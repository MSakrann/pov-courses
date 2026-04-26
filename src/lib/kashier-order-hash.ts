import crypto from "crypto";

export type KashierOrderHashInput = {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  secret: string;
};

/**
 * Kashier docs formula:
 * path = /?payment={mid}.{orderId}.{amount}.{currency}
 * hash = HMAC_SHA256(path, secret) in hex
 */
export function generateKashierOrderHash(input: KashierOrderHashInput): string {
  const path = `/?payment=${input.merchantId}.${input.orderId}.${input.amount}.${input.currency}`;
  return crypto.createHmac("sha256", input.secret).update(path).digest("hex");
}
