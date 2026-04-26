"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const pad = (n: number) => n.toString().padStart(2, "0");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(s / 86400)),
    hours: pad(Math.floor((s % 86400) / 3600)),
    mins: pad(Math.floor((s % 3600) / 60)),
    secs: pad(s % 60),
  };
}

export function Countdown() {
  const t = useTranslations("landing");
  const raw = process.env.NEXT_PUBLIC_SALE_END_AT;
  const target = raw ? new Date(raw) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const { days, hours, mins, secs } = useCountdown(target);
  return (
    <section className="bg-brand-gray py-12" aria-label={t("countdownTitle")}>
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { v: days, l: "DAYS" },
            { v: hours, l: "HOURS" },
            { v: mins, l: "MINS" },
            { v: secs, l: "SECS" },
          ].map((x) => (
            <div
              key={x.l}
              className="rounded-2xl border-2 border-brand-red/20 bg-white p-4 text-center shadow"
            >
              <div className="text-4xl font-extrabold text-ink">{x.v}</div>
              <div className="mt-1 text-xs font-semibold tracking-widest text-ink/60">
                {x.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
