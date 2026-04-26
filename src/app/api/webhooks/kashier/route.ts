import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyKashierSignature } from "@/lib/kashier-signature";
import { getAccessDays } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function findOrderId(obj: unknown): string | null {
  if (obj && typeof obj === "object") {
    const o = obj as Record<string, unknown>;
    const cands = [o.merchantOrderId, o.orderId, o.order_id, o.reference];
    for (const c of cands) {
      if (typeof c === "string" && c) return c;
    }
    if (o.data && typeof o.data === "object" && o.data !== null) {
      const d = o.data as Record<string, unknown>;
      if (typeof d.orderId === "string") return d.orderId;
      if (d.order && typeof d.order === "object" && d.order !== null) {
        const order = d.order as Record<string, unknown>;
        if (typeof order.id === "string") return order.id;
        if (typeof order.merchantOrderId === "string") return order.merchantOrderId;
      }
    }
    if (o.order && typeof o.order === "object" && o.order !== null) {
      const order = o.order as Record<string, unknown>;
      if (typeof order.id === "string") return order.id;
    }
  }
  return null;
}

function isSuccessfulPayment(obj: unknown): boolean {
  if (obj && typeof obj === "object") {
    const o = obj as Record<string, unknown>;
    const s = o.status || (o.data as Record<string, unknown> | undefined)?.status;
    const str = String(s).toLowerCase();
    if (str.includes("success") || str === "paid" || str === "captured" || str === "completed") {
      return true;
    }
    if (o.paymentStatus && String(o.paymentStatus).toLowerCase() === "success") return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const secret = process.env.KASHIER_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  const sigHeader =
    request.headers.get("x-kashier-signature") ||
    request.headers.get("X-Kashier-Signature") ||
    request.headers.get("x-signature");
  if (!verifyKashierSignature(raw, sigHeader, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!isSuccessfulPayment(json)) {
    return NextResponse.json({ received: true, activated: false });
  }
  const orderId = findOrderId(json);
  if (!orderId) {
    return NextResponse.json({ error: "order id missing" }, { status: 400 });
  }
  const purchase = await prisma.purchase.findFirst({
    where: { kashierOrderId: orderId },
  });
  if (!purchase) {
    return NextResponse.json({ received: true, activated: false, note: "order not found" });
  }
  const accessDays = getAccessDays();
  const expiresAt = new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000);
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status: "active",
      expiresAt,
      kashierOrderId: orderId,
    },
  });
  return NextResponse.json({ received: true, activated: true });
}
