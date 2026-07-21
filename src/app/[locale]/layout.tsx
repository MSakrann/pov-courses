import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { AuthStateProvider } from "@/components/auth/AuthStateProvider";
import { LocaleAttributes } from "@/components/LocaleAttributes";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleAttributes>
        <AuthStateProvider>
          <div dir={dir} className="min-h-screen bg-white">
            {children}
          </div>
        </AuthStateProvider>
      </LocaleAttributes>
    </NextIntlClientProvider>
  );
}
