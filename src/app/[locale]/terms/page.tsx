import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/Navbar";

export default async function TermsPage() {
  const t = await getTranslations("common");
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-12 text-ink/90">
        <h1 className="text-3xl font-extrabold text-ink">{t("brand")} — Terms</h1>
        <p className="mt-4 text-sm">
          Placeholder page. Add your real terms of service here before going live.
        </p>
      </div>
    </div>
  );
}
