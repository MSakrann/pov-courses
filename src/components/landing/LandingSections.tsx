import { getTranslations, getMessages } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Countdown } from "./Countdown";
import { Navbar } from "../Navbar";
import { TestimonialCards } from "./TestimonialCards";
import { BundleShowcase } from "./BundleShowcase";

type DayBlock = {
  day: number;
  title: string;
  overlay: string;
  bullets: string[];
  exercise: string;
};

export async function LandingSections() {
  const t = await getTranslations();
  const tCur = await getTranslations("curriculum");
  const messages = (await getMessages()) as { curriculum?: { days: DayBlock[] } };
  const days: DayBlock[] = messages?.curriculum?.days || [];
  const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "48";
  const orig = process.env.NEXT_PUBLIC_ORIGINAL_PRICE || "1,386";
  const year = new Date().getFullYear();
  const countLabel = "152,000";

  return (
    <>
      <a
        className="block w-full bg-black py-2 text-center text-sm text-white"
        href="#get-access"
      >
        {t.rich("landing.topBar", {
          highlight: (c) => <span className="text-brand-red font-semibold">{c}</span>,
        })}
      </a>
      <Navbar />
      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {t("landing.heroH1")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-ink/80 sm:mx-0 sm:text-left">
            <span className="bg-yellow-200 px-1 font-bold">
              {t("landing.heroSubPrefix")}{" "}
            </span>
            {t("landing.heroSubRest")}
          </p>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-lg">
              <div className="relative aspect-video w-full">
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
              className="rounded-3xl bg-brand-gray p-6 sm:p-8 shadow-inner ring-1 ring-black/5"
            >
              <p className="text-ink/90">{t("landing.heroFor")}</p>
              <p className="mt-3 font-extrabold text-brand-red">{t("landing.heroSale")}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-sm text-ink/60">
                  {t("landing.normalPrice")}:{" "}
                  <span className="text-xl font-bold text-brand-red line-through">
                    ${orig}
                  </span>
                </span>
              </div>
              <p className="mt-1 text-3xl font-extrabold text-ink">
                ${price}{" "}
                <span className="text-base font-medium text-ink/60">
                  {t("landing.currency")}
                </span>
              </p>
              <p className="mt-2 text-sm text-ink/60">{t("landing.heroExpires")}</p>
              <Link
                className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-green py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90"
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
        <p className="text-center text-lg text-ink">
          {t("landing.socialProof", { count: countLabel })}
        </p>
        <div className="mx-auto mt-6 flex max-w-3xl justify-center">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {Array.from({ length: 7 }).map((_, i) => (
              <Image
                key={i}
                className="h-12 w-12 rounded-full border-2 border-white object-cover"
                src={`https://i.pravatar.cc/100?img=${i + 1}`}
                width={48}
                height={48}
                alt=""
              />
            ))}
          </div>
        </div>
      </section>
      <BundleShowcase
        orig={orig}
        price={price}
        title={t("landing.bundle.title", { brand: t("common.brand") })}
        bigSale={t("landing.bundle.bigSale", { season: t("landing.bundle.season") })}
        today={t("landing.bundle.today")}
      />
      <section className="bg-brand-gray py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm font-bold uppercase text-brand-red">
            {t("landing.courseBlock.label")}
          </p>
          <h2 className="mt-2 text-4xl font-extrabold text-ink">
            {t("landing.courseBlock.courseName")}
          </h2>
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="relative mx-auto aspect-[16/9] max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image
                src="https://placehold.co/1200x675/f5f5f5/1a1a1a?text=Course+mockup"
                alt=""
                width={1200}
                height={675}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <h3 className="mt-10 text-4xl font-extrabold text-ink">
              {t("landing.courseBlock.whatYouLearn")}
            </h3>
            <div className="mx-auto mt-4 h-1 w-24 bg-brand-red" />
          </div>
        </div>
        <div className="mt-6 space-y-0">
          {days.map((d, idx) => (
            <div
              key={d.day}
              className={idx % 2 === 0 ? "bg-white" : "bg-brand-gray/80"}
            >
              <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2">
                <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <h4 className="text-2xl font-bold text-ink sm:text-3xl">
                    <span className="font-bold italic text-brand-red">
                      {tCur("dayLabel", { n: d.day })}
                    </span>{" "}
                    {d.title}
                  </h4>
                  <ul className="mt-4 space-y-2 text-ink/90">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-start">
                        <span className="shrink-0 text-brand-red" aria-hidden>
                          ▶️
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                    <li className="pt-1 font-extrabold text-ink">
                      <span className="me-1 text-brand-red">▶️</span>
                      {d.exercise}
                    </li>
                  </ul>
                </div>
                <div
                  className={`relative overflow-hidden rounded-xl shadow-lg ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={`https://placehold.co/800x450/2D3E50/ffffff?text=${encodeURIComponent(
                        d.overlay
                      )}`}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-center text-2xl font-extrabold tracking-wide text-white drop-shadow sm:text-3xl">
                        {d.overlay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="bg-white py-12 text-center">
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-brand-green px-10 py-4 text-lg font-extrabold text-white shadow-lg hover:opacity-90"
        >
          {t("landing.midCta", { price: `$${price}` })}
        </Link>
      </div>
      <section className="bg-brand-navy py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {t.rich("landing.testimonialsH2", {
              count: (c) => <span className="font-bold text-brand-red">{c}</span>,
            })}
          </h2>
        </div>
        <TestimonialCards />
      </section>
      <footer className="bg-white py-10 text-center">
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-brand-green px-10 py-4 text-lg font-extrabold text-white shadow-lg hover:opacity-90"
        >
          {t("landing.footerCta", { price: `$${price}` } as { price: string } & Record<string, string>)}
        </Link>
        <p className="mt-6 text-sm text-ink/70">
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
