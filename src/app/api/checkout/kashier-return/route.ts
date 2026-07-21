import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { activatePurchaseByOrderId } from "@/lib/activate-purchase";
import {
  getKashierRedirectOrderId,
  isKashierRedirectSuccess,
  verifyKashierRedirectSignature,
} from "@/lib/kashier-redirect";
import { routing, type AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function baseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function resultRedirect(locale: string, params: Record<string, string>) {
  const url = new URL(`/${locale}/checkout/result`, baseUrl());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return NextResponse.redirect(url);
}

async function resolveLocale(): Promise<AppLocale> {
  const session = await getSessionFromCookies();
  if (session?.sub) {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { lang: true },
    });
    if (user?.lang && routing.locales.includes(user.lang as AppLocale)) {
      return user.lang as AppLocale;
    }
  }
  return routing.defaultLocale;
}

/**
 * Browser return URL after Kashier payment (iframe / HPP).
 * Configure Kashier dashboard webhook separately to POST /api/webhooks/kashier.
 */
export async function GET(request: NextRequest) {
  const locale = await resolveLocale();
  const params = request.nextUrl.searchParams;
  const secret =
    process.env.KASHIER_IFRAME_SECRET ||
    process.env.KASHIER_API_KEY ||
    "";

  if (!secret) {
    return resultRedirect(locale, { status: "error", reason: "misconfigured" });
  }

  const signatureOk = verifyKashierRedirectSignature(params, secret);
  if (!signatureOk) {
    return resultRedirect(locale, { status: "error", reason: "bad_signature" });
  }

  const orderId = getKashierRedirectOrderId(params);
  const paid = isKashierRedirectSuccess(params);

  if (!paid) {
    return resultRedirect(locale, {
      status: "failed",
      ...(orderId ? { orderId } : {}),
    });
  }

  if (!orderId) {
    return resultRedirect(locale, { status: "error", reason: "missing_order" });
  }

  // Activate here as a backup; webhook remains the primary server-to-server path.
  const result = await activatePurchaseByOrderId(orderId);
  if (!result.activated) {
    return resultRedirect(locale, { status: "pending", orderId });
  }

  return resultRedirect(locale, { status: "success", orderId });
}
