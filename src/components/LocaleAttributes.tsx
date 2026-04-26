"use client";

import { useParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { routing } from "@/i18n/routing";

export function LocaleAttributes({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const loc = (params?.locale as string) || routing.defaultLocale;
  const locale = routing.locales.includes(loc as (typeof routing.locales)[number])
    ? loc
    : routing.defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return <>{children}</>;
}
