import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { KashierPanel } from "@/components/checkout/KashierPanel";
import { Navbar } from "@/components/Navbar";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export default async function CheckoutPage({ params: { locale } }: Props) {
  const s = await getSessionFromCookies();
  if (!s?.sub) {
    redirect(`/${locale}/login`);
  }
  const t = await getTranslations("checkout");
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1450";
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-extrabold text-ink">{t("title")}</h1>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-brand-gray/40 p-6">
          <h2 className="text-lg font-bold text-ink">{t("summary")}</h2>
          <p className="mt-2 text-2xl font-extrabold text-brand-red">{price} EGP</p>
          <p className="mt-1 font-medium text-ink">{t("courseName")}</p>
          <ul className="mt-4 list-inside list-disc text-sm text-ink/80">
            <li>{t("included1")}</li>
            <li>{t("included2")}</li>
            <li>{t("included3")}</li>
          </ul>
        </div>
        <div className="mt-8">
          <KashierPanel />
        </div>
      </div>
    </div>
  );
}
