import { prisma } from "@/lib/prisma";
import { getAccessDays } from "@/lib/constants";

/** Activate (or refresh) course access for a Kashier merchant order id. Idempotent. */
export async function activatePurchaseByOrderId(orderId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: { kashierOrderId: orderId },
  });
  if (!purchase) {
    return { activated: false as const, reason: "order_not_found" as const };
  }
  if (purchase.status === "active" && purchase.expiresAt.getTime() > Date.now()) {
    return {
      activated: true as const,
      alreadyActive: true as const,
      purchaseId: purchase.id,
      expiresAt: purchase.expiresAt,
    };
  }
  const accessDays = getAccessDays();
  const expiresAt = new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000);
  const updated = await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status: "active",
      expiresAt,
      kashierOrderId: orderId,
    },
  });
  return {
    activated: true as const,
    alreadyActive: false as const,
    purchaseId: updated.id,
    expiresAt: updated.expiresAt,
  };
}
