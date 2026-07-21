import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { prisma } from "@/lib/prisma";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Navbar } from "@/components/Navbar";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export default async function RegisterPage({ params: { locale } }: Props) {
  const s = await getSessionFromCookies();
  if (s?.sub) {
    const p = await prisma.purchase.findUnique({ where: { userId: s.sub } });
    const now = Date.now();
    if (p?.status === "active" && p.expiresAt.getTime() > now) {
      redirect(`/${locale}/profile`);
    }
  }
  const t = await getTranslations("auth");
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-center text-3xl font-extrabold text-ink">{t("registerTitle")}</h1>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
