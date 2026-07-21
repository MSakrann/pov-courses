import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { getAccessDays } from "@/lib/constants";
import { generateKashierOrderHash } from "@/lib/kashier-order-hash";

/**
 * Call when the user starts Kashier payment: stores a pending purchase
 * and returns the internal order id to pass to Kashier as your merchant order reference.
 */
export async function POST() {
  const session = await getSessionFromCookies();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const existing = await prisma.purchase.findUnique({ where: { userId: session.sub } });
  if (existing?.status === "active" && existing.expiresAt.getTime() > now.getTime()) {
    return NextResponse.json(
      { error: "You already have active access" },
      { status: 409 }
    );
  }
  const kashierOrderId = `ord_${session.sub.slice(0, 8)}_${randomUUID()}`;
  const placeholderExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const accessDays = getAccessDays();

  await prisma.purchase.upsert({
    where: { userId: session.sub },
    create: {
      userId: session.sub,
      kashierOrderId,
      status: "pending",
      expiresAt: placeholderExpiry,
    },
    update: {
      kashierOrderId,
      status: "pending",
      expiresAt: placeholderExpiry,
    },
  });

  const merchantId = process.env.KASHIER_MERCHANT_ID || "";
  const secret = process.env.KASHIER_IFRAME_SECRET || process.env.KASHIER_API_KEY || "";
  const mode = process.env.KASHIER_MODE === "live" ? "live" : "test";
  const currency = process.env.NEXT_PUBLIC_KASHIER_CURRENCY || "EGP";
  const amount = process.env.NEXT_PUBLIC_COURSE_PRICE || "1450";
  // Browser return (GET) — never point this at the POST-only webhook.
  const merchantRedirect = `${(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "")}/api/checkout/kashier-return`;
  const webhookUrl = `${(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "")}/api/webhooks/kashier`;

  if (!merchantId || !secret) {
    return NextResponse.json(
      { error: "Kashier credentials are not configured" },
      { status: 500 }
    );
  }

  const hash = generateKashierOrderHash({
    merchantId,
    orderId: kashierOrderId,
    amount,
    currency,
    secret,
  });

  const scriptSrc =
    mode === "live"
      ? "https://iframe.kashier.io/js/kashier-checkout.js"
      : "https://test-iframe.kashier.io/js/kashier-checkout.js";

  return NextResponse.json({
    kashierOrderId,
    mode,
    accessDays,
    iframe: {
      scriptSrc,
      attrs: {
        "data-amount": amount,
        "data-description": process.env.NEXT_PUBLIC_KASHIER_DESCRIPTION || "Course access",
        "data-hash": hash,
        "data-currency": currency,
        "data-orderId": kashierOrderId,
        "data-merchantId": merchantId,
        "data-merchantRedirect": merchantRedirect,
        "data-store": process.env.NEXT_PUBLIC_KASHIER_STORE || "Pov Courses",
        "data-type": "external",
        "data-display": process.env.NEXT_PUBLIC_KASHIER_DISPLAY || "en",
        "data-allowedMethods": process.env.NEXT_PUBLIC_KASHIER_ALLOWED_METHODS || "",
        "data-mode": mode,
      },
    },
    /** Configure this URL in the Kashier merchant dashboard (server webhook). */
    webhookUrl,
  });
}
