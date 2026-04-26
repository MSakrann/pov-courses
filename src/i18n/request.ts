import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import arCurriculum from "../messages/curriculum.ar.json";
import enCurriculum from "../messages/curriculum.en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const base = (await import(`../messages/${locale}.json`)).default;
  const dayBlocks = locale === "ar" ? arCurriculum : enCurriculum;
  return {
    locale,
    messages: {
      ...base,
      curriculum: {
        ...((base as { curriculum?: object }).curriculum || {}),
        days: dayBlocks.days,
      },
    },
  };
});
