import crypto from "crypto";

/**
 * Verifies Kashier browser redirect / HPP callback signature.
 * Matches Kashier's official PHP demo: HMAC-SHA256 over query params
 * excluding `signature` and `mode`, in the order they appear in the URL.
 */
export function verifyKashierRedirectSignature(
  searchParams: URLSearchParams,
  secret: string
): boolean {
  const provided = searchParams.get("signature");
  if (!provided || !secret) return false;

  const parts: string[] = [];
  searchParams.forEach((value, key) => {
    if (key === "signature" || key === "mode") return;
    parts.push(`${key}=${value}`);
  });
  const queryString = parts.join("&");
  const expected = crypto.createHmac("sha256", secret).update(queryString, "utf8").digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function getKashierRedirectOrderId(searchParams: URLSearchParams): string | null {
  const cands = [
    searchParams.get("merchantOrderId"),
    searchParams.get("orderId"),
    searchParams.get("order_id"),
    searchParams.get("OrderId"),
  ];
  for (const c of cands) {
    if (c) return c;
  }
  return null;
}

export function isKashierRedirectSuccess(searchParams: URLSearchParams): boolean {
  const status = (
    searchParams.get("paymentStatus") ||
    searchParams.get("status") ||
    searchParams.get("PaymentStatus") ||
    ""
  ).toLowerCase();
  return (
    status.includes("success") ||
    status === "paid" ||
    status === "captured" ||
    status === "completed"
  );
}
