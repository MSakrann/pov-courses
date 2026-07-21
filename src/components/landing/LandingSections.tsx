import { getTranslations, getMessages } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Countdown } from "./Countdown";
import { Navbar } from "../Navbar";
import { FullWidthSectionImage } from "./FullWidthSectionImage";
import { BonusProgramsSection, type BonusProgramCard } from "./BonusProgramsSection";
import { SaleBonusesRowsSection, type SaleBonusRow } from "./SaleBonusesRowsSection";

type DayBlock = {
  day: number;
  title: string;
  overlay?: string;
  gif?: string;
  bullets: string[];
  exercise?: string;
};

export async function LandingSections() {
  const t = await getTranslations();
  const tCur = await getTranslations("curriculum");
  const messages = (await getMessages()) as {
    curriculum?: { days: DayBlock[] };
    landing?: {
      bonusPrograms?: { cards: BonusProgramCard[] };
      saleBonuses?: { sectionTitle: string; rows: SaleBonusRow[] };
    };
  };
  const days: DayBlock[] = messages?.curriculum?.days || [];
  const bonusProgramCards = messages?.landing?.bonusPrograms?.cards;
  const saleBonuses = messages?.landing?.saleBonuses;
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1450";
  const orig = process.env.NEXT_PUBLIC_ORIGINAL_PRICE || "7000";
  const teachingPreviewYoutubeId =
    process.env.NEXT_PUBLIC_TEACHING_PREVIEW_YOUTUBE_ID?.trim() || "dQw4w9WgXcQ";
  const year = new Date().getFullYear();
  const countLabel = "135,000";

  /** Add 6 square images (e.g. ~200×200+) as: public/trusted-by/avatar-1.jpg … avatar-6.jpg */
  const trustedByAvatars = [
    "/trusted-by/avatar-1.png",
    "/trusted-by/avatar-2.png",
    "/trusted-by/avatar-3.png",
    "/trusted-by/avatar-4.png",
    "/trusted-by/avatar-5.jpeg",
    "/trusted-by/avatar-6.jpeg",
  ];

  return (
    <>
      <a
        className="block w-full bg-black py-3 text-center text-xl font-extrabold leading-tight text-white sm:py-4 sm:text-3xl"
        href="#get-access"
      >
        {t.rich("landing.topBar", {
          highlight: (c) => <span className="font-semibold text-[#EC750C]">{c}</span>,
        })}
      </a>
      <Navbar />
      <section className="bg-white pb-3 pt-5 sm:pb-4 sm:pt-5">
        <div className="mx-auto max-w-[1280px] px-4 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-[42px]">
            {t("landing.heroH1")}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-[20px] text-ink/80">
            <span className="bg-orange-300 px-1 font-medium text-ink">
              {t("landing.heroSubPrefix")}
            </span>{" "}
            {t("landing.heroSubRest")}
          </p>
          <div className="mt-8 grid items-stretch gap-6 lg:mt-9 lg:grid-cols-[723px_640px] lg:justify-center lg:gap-5">
            <div className="mx-auto flex w-full max-w-[723px] overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-lg lg:h-[406px] lg:w-[723px] lg:max-w-none">
              <div className="relative aspect-[723/406] w-full lg:h-full lg:aspect-auto">
                <iframe
                  className="h-full w-full"
                  title="Preview"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div
              id="get-access"
              className="flex h-full flex-col justify-center rounded-3xl bg-[#ecf0f1] px-8 py-6 text-center shadow-inner ring-1 ring-black/5 sm:px-10 sm:py-7 lg:h-[406px]"
            >
              <p className="text-ink/90">
                {t.rich("landing.heroFor", {
                  br: () => <br />,
                })}
              </p>
              <div className="mt-4 flex items-baseline justify-center gap-3">
                <span className="text-sm text-ink/60">
                  {t("landing.normalPrice")}:{" "}
                  <span className="text-xl font-bold text-brand-red line-through">
                    {orig}
                  </span>
                </span>
              </div>
              <p className="mt-1 text-3xl font-extrabold text-ink">
                {price}{" "}
                <span className="text-base font-medium text-ink/60">
                  {t("landing.currency")}
                </span>
              </p>
              <p className="mt-2 text-sm text-ink/60">{t("landing.heroExpires")}</p>
              <Link
                className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-red py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90"
                href="/checkout"
              >
                {t("common.getAccess")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Countdown />
      <section className="bg-white py-10">
        <div className="mx-auto flex w-full max-w-[430px] flex-col items-center px-6 sm:h-[106px] sm:px-0">
          <p className="text-center text-lg text-ink">
            {t("landing.socialProof", { count: countLabel })}
          </p>
          <div className="mt-[5px] flex w-full justify-center -space-x-2 px-2 sm:-space-x-3 sm:px-0">
            {trustedByAvatars.map((src) => (
              <Image
                key={src}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover sm:h-20 sm:w-20"
                src={src}
                width={80}
                height={80}
                alt=""
              />
            ))}
          </div>
        </div>
      </section>
      <FullWidthSectionImage
        src="/images/sections/section-1.png"
        alt={t("landing.bundle.promoImageAlt")}
        priority
      />
      <FullWidthSectionImage
        src="/images/sections/section-2.png"
        alt={t("landing.courseBlock.showcaseImageAlt")}
        className="bg-[#ecf0f1]"
        maxInnerHeight={600}
      />
      <section className="bg-[#ecf0f1] pb-16">
        <div className="bg-white py-12">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h3 className="text-[42px] font-extrabold text-ink">
              {t("landing.courseBlock.whatYouLearn")}
            </h3>
          </div>
          <div className="mx-auto mt-5 max-w-[1400px] px-4">
            <div className="mx-auto h-px w-[1314px] bg-[#ecf0f1]" />
          </div>
        </div>
        <div className="space-y-0">
          {days.map((d, idx) => (
            <div
              key={d.day}
              className={idx % 2 === 0 ? "bg-white" : "bg-[#ecf0f1]"}
            >
              <div className="mx-auto grid max-w-[1400px] items-stretch gap-6 px-4 py-10 lg:grid-cols-[645px_645px] lg:justify-center">
                <div className="rounded-2xl bg-transparent p-[15px] lg:min-h-[340px] lg:w-[645px]">
                  <h4 className="text-[36px] font-medium leading-tight text-ink">
                    <span className="font-bold text-brand-red">
                      {tCur("dayLabel", { n: d.day })}
                    </span>{" "}
                    {d.title}
                  </h4>
                  <ul className="mt-4 space-y-2 text-[18px] text-ink/90">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-start">
                        <span className="shrink-0 text-brand-red" aria-hidden>
                          ▶
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                    {d.exercise ? (
                      <li className="pt-1 font-extrabold text-ink">
                        <span className="me-1 text-brand-red">▶</span>
                        {d.exercise}
                      </li>
                    ) : null}
                  </ul>
                </div>
                <div className="rounded-2xl bg-transparent p-[15px] lg:min-h-[340px] lg:w-[645px]">
                  <div className="relative h-[240px] w-full overflow-hidden rounded-xl sm:h-[280px] lg:h-[310px]">
                  <img
                    src={d.gif || "/images/curriculum/design-1.gif"}
                    alt={d.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FullWidthSectionImage
        src="/images/sections/section-3.png"
        alt={t("landing.courseBlock.afterModulesImageAlt")}
        className="bg-black"
        maxInnerHeight={600}
      />
      {Array.isArray(bonusProgramCards) && bonusProgramCards.length === 3 ? (
        <BonusProgramsSection cards={bonusProgramCards} />
      ) : null}
      {saleBonuses?.sectionTitle &&
      saleBonuses.rows &&
      saleBonuses.rows.length > 0 ? (
        <SaleBonusesRowsSection
          sectionTitle={saleBonuses.sectionTitle}
          rows={saleBonuses.rows}
        />
      ) : null}
      <FullWidthSectionImage
        src="/images/sections/section-4.png"
        alt={t("landing.saleBonuses.afterRowsImageAlt")}
        className="bg-[#ee740c]"
        maxInnerHeight={600}
      />
      <section className="bg-[#ecf0f1] py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h3 className="text-center text-[42px] font-extrabold text-ink">
            {t("landing.creatorsSection.title")}
          </h3>
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-md shadow-lg">
            <Image
              src="/images/creators/meet-your-instructors.png"
              alt={t("landing.creatorsSection.imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority={false}
            />
          </div>
          <div className="mx-auto mt-6 max-w-4xl space-y-4 text-[18px] font-medium leading-relaxed text-ink/85">
            {[1, 2, 3, 4, 5].map((item) => (
              <p key={item}>{t(`landing.creatorsSection.p${item}`)}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-[38px] sm:leading-tight lg:text-[42px]">
            {t("landing.teachingPreview.title")}
          </h2>
          <p className="mt-4 text-xl font-normal text-ink sm:text-2xl">
            {t("landing.teachingPreview.subtitle")}
          </p>
          <div className="mx-auto mt-10 w-full max-w-[940px]">
            <div className="relative aspect-[940/530] w-full overflow-hidden rounded-[26px] bg-black shadow-[0_22px_48px_-10px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.08]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${teachingPreviewYoutubeId}`}
                title={t("landing.teachingPreview.iframeTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black px-6 py-12 sm:px-8 sm:py-14">
        <div className="mx-auto flex justify-center">
          <Link
            href="/checkout"
            className="flex w-full max-w-[640px] items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-center text-[17px] font-bold leading-snug text-white transition-[filter] hover:brightness-110 sm:px-12 sm:py-[18px] sm:text-lg"
          >
            {t("landing.springSaleStrip.cta", {
              price: `${price} ${t("landing.currency")}`,
            } as { price: string })}
          </Link>
        </div>
      </section>
      <section className="bg-brand-red py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-[28px] border border-black/20 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-10">
            <h3 className="text-center text-2xl font-extrabold text-ink sm:text-3xl">
              {t("landing.whoFor.title")}
            </h3>
            <ul className="mt-6 space-y-4 text-base leading-relaxed text-ink/90 sm:text-lg">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-6 w-6 items-center justify-center text-xl font-black leading-none text-green-600"
                    aria-hidden
                  >
                    ✔
                  </span>
                  <span>{t(`landing.whoFor.item${item}`)}</span>
                </li>
              ))}
            </ul>
            <h4 className="mt-10 text-center text-2xl font-extrabold text-ink sm:text-3xl">
              {t("landing.whoNeed.title")}
            </h4>
            <ul className="mt-6 space-y-4 text-base leading-relaxed text-ink/90 sm:text-lg">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-6 w-6 items-center justify-center text-xl font-black leading-none text-green-600"
                    aria-hidden
                  >
                    ✔
                  </span>
                  <span>{t(`landing.whoNeed.item${item}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 rounded-[28px] border border-black/20 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-10">
            <h4 className="text-center text-2xl font-extrabold text-ink sm:text-3xl">
              {t("landing.whoNotFor.title")}
            </h4>
            <ul className="mt-6 space-y-4 text-base leading-relaxed text-ink/90 sm:text-lg">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-6 w-6 items-center justify-center text-xl font-black leading-none text-red-600"
                    aria-hidden
                  >
                    ✖
                  </span>
                  <span>{t(`landing.whoNotFor.item${item}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-[960px] justify-center">
          <Image
            src="/images/landing/ugc-offer-banner.png"
            alt={t("landing.ugcOfferBanner.alt")}
            width={960}
            height={1200}
            className="h-auto w-full object-contain"
            sizes="(max-width: 1024px) 100vw, 960px"
            quality={92}
          />
        </div>
      </section>
      <section className="bg-brand-red py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="text-center text-3xl font-extrabold text-white sm:text-4xl">
            {t("landing.faq.title")}
          </h3>
          <div className="mt-6 space-y-5">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-black/20 bg-white px-6 py-6 shadow-lg sm:px-8"
              >
                <h4 className="text-2xl font-medium leading-tight text-ink">
                  {t(`landing.faq.q${item}`)}
                </h4>
                <p className="mt-4 text-base leading-relaxed text-ink/85">
                  {t(`landing.faq.a${item}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-black px-6 py-10 text-center sm:px-8">
        <div className="mx-auto flex justify-center">
          <Link
            href="/checkout"
            className="flex w-full max-w-[640px] items-center justify-center rounded-full bg-brand-red px-8 py-4 text-center text-[17px] font-extrabold leading-snug text-white shadow-lg transition-opacity hover:opacity-90 sm:px-12 sm:py-[18px] sm:text-lg"
          >
            {t("landing.footerCta", { price: `${price} EGP` } as { price: string } & Record<string, string>)}
          </Link>
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#ecf0f1]" aria-hidden />
      <footer className="bg-white py-10 text-center">
        <p className="text-sm text-ink/70">
          {t("landing.footer.copy", { year, brand: t("common.brand") } as { year: number; brand: string })}
        </p>
        <p className="mt-2 text-sm">
          <Link href="/privacy" className="text-brand-red underline">
            {t("landing.footer.privacy")}
          </Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="text-brand-red underline">
            {t("landing.footer.terms")}
          </Link>
        </p>
      </footer>
    </>
  );
}
