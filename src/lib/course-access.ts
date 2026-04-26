import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSessionFromCookies } from "./auth-cookies";

export type CourseAccessResult =
  | { ok: true; userId: string; expiresAt: Date }
  | { ok: false; reason: "no_session" | "no_purchase" | "not_active" | "expired" };

export async function getCourseAccess(): Promise<CourseAccessResult> {
  const session = await getSessionFromCookies();
  if (!session?.sub) {
    return { ok: false, reason: "no_session" };
  }
  const purchase = await prisma.purchase.findUnique({
    where: { userId: session.sub },
  });
  if (!purchase) {
    return { ok: false, reason: "no_purchase" };
  }
  if (purchase.status !== "active") {
    return { ok: false, reason: "not_active" };
  }
  if (purchase.expiresAt.getTime() <= Date.now()) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, userId: session.sub, expiresAt: purchase.expiresAt };
}

export async function requireCoursePageAccess() {
  const access = await getCourseAccess();
  if (access.ok) return access;
  const locale = await getLocale();
  const session = await getSessionFromCookies();
  if (!session?.sub) {
    redirect(`/${locale}/login`);
  }
  redirect(`/${locale}/checkout`);
}
