import crypto from "crypto";

/**
 * Verifies Kashier webhook HMAC. Adjust the algorithm/header name
 * to match your Kashier dashboard if their format differs.
 * Raw body + secret are used; header defaults to `x-kashier-signature`.
 */
export function verifyKashierSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;
  const h = crypto.createHmac("sha256", secret);
  h.update(rawBody, "utf8");
  const expected = h.digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
