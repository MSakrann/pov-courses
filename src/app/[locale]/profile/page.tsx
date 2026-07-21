import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export default async function ProfilePage({ params: { locale } }: Props) {
  const session = await getSessionFromCookies();
  if (!session?.sub) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { purchase: true },
  });
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("profile");
  const tCheckout = await getTranslations("checkout");

  const now = Date.now();
  const p = user.purchase;
  type Enrollment = "none" | "pending" | "active" | "inactive";
  let enrollment: Enrollment = "none";
  let activeExpiresAt: Date | null = null;
  if (p) {
    if (p.status === "pending") {
      enrollment = "pending";
    } else if (p.status === "active" && p.expiresAt.getTime() > now) {
      enrollment = "active";
      activeExpiresAt = p.expiresAt;
    } else {
      enrollment = "inactive";
    }
  }

  const dateLocale = locale === "ar" ? "ar-EG" : undefined;
  const dateFmt = new Intl.DateTimeFormat(dateLocale ?? "en-GB", { dateStyle: "long" });

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pb-14 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-extrabold text-ink">{t("title")}</h1>
          <LogoutButton />
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">{t("accountDetails")}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-ink/65">{t("nameLabel")}</dt>
              <dd className="mt-1 text-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink/65">{t("emailLabel")}</dt>
              <dd className="mt-1 text-ink">{user.email}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-ink">{t("yourCourses")}</h2>
          {enrollment === "none" ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-brand-gray/30 p-8 text-center text-ink/80">
              <p>{t("noEnrollment")}</p>
              <Link
                href="/checkout"
                className="mt-4 inline-block rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
              >
                {t("goCheckout")}
              </Link>
            </div>
          ) : (
            <article className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
                <h3 className="text-lg font-semibold leading-snug text-ink">
                  {tCheckout("courseName")}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    enrollment === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : enrollment === "pending"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-zinc-200 text-zinc-800"
                  }`}
                >
                  {enrollment === "active"
                    ? t("badgeActive")
                    : enrollment === "pending"
                      ? t("badgePending")
                      : t("badgeInactive")}
                </span>
              </div>
              {activeExpiresAt ? (
                <p className="mt-4 text-sm text-ink/80">
                  {t("courseAccessUntil", { date: dateFmt.format(activeExpiresAt) })}
                </p>
              ) : null}
              <div className="mt-6">
                {enrollment === "active" ? (
                  <Link
                    href="/course"
                    className="inline-flex rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
                  >
                    {t("continueCourse")}
                  </Link>
                ) : (
                  <Link
                    href="/checkout"
                    className="inline-flex rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:opacity-90"
                  >
                    {enrollment === "pending" ? t("finishPayment") : t("goCheckout")}
                  </Link>
                )}
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
