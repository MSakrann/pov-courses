"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useAuthState } from "@/components/auth/AuthStateProvider";

export function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";
  const { authState } = useAuthState();

  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-ink">
          <Image
            src="/pov-logo-black-no-bg.png"
            alt={tCommon("brand")}
            width={180}
            height={180}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-2 text-sm font-medium sm:gap-4">
          <Link href="/" className="text-ink/80 hover:text-brand-red">
            {t("home")}
          </Link>
          <Link href="/course" className="text-ink/80 hover:text-brand-red">
            {t("course")}
          </Link>
          {authState === "guest" || authState === "loading" ? (
            <Link href="/login" className="text-ink/80 hover:text-brand-red">
              {tCommon("login")}
            </Link>
          ) : authState === "buyer" ? (
            <Link href="/profile" className="text-ink/80 hover:text-brand-red">
              {tCommon("account")}
            </Link>
          ) : (
            <Link href="/checkout" className="text-ink/80 hover:text-brand-red">
              {t("checkout")}
            </Link>
          )}
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
