import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import { getLocale } from "next-intl/server";

const clash = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Medium.otf", weight: "400 500", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pov Studio — Filmmaking Course",
  description: "Bilingual course platform",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${clash.variable} min-h-screen bg-white text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
