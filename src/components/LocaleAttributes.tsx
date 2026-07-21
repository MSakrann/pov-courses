"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";

export function LocaleAttributes({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return <>{children}</>;
}
