"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";

  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-ink">
          {tCommon("brand")}
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-2 text-sm font-medium sm:gap-4">
          <Link href="/" className="text-ink/80 hover:text-brand-red">
            {t("home")}
          </Link>
          <Link href="/course" className="text-ink/80 hover:text-brand-red">
            {t("course")}
          </Link>
          <Link href="/login" className="text-ink/80 hover:text-brand-red">
            {tCommon("login")}
          </Link>
          <Link
            href={pathname}
            locale={other}
            className="rounded-full border border-brand-red px-3 py-1 text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white"
          >
            {other === "ar" ? "العربية" : "English"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
