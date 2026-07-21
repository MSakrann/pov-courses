"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const pad = (n: number) => n.toString().padStart(2, "0");
const FIRST_VISIT_DURATION_MS =
  ((7 * 24 + 12) * 60 * 60 + 30 * 60 + 30) * 1000;
const COUNTDOWN_STORAGE_KEY = "pov_ugc30_countdown_end_at";

function useCountdown(targetMs: number | null) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now == null) {
    return { days: "00", hours: "00", mins: "00", secs: "00" };
  }

  const diff = Math.max(0, (targetMs ?? now) - now);
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
  const [targetMs, setTargetMs] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed) && parsed > 0) {
          setTargetMs(parsed);
          return;
        }
      }
    } catch {
      // Ignore storage errors and fall back to in-memory timer.
    }

    const firstVisitTarget = Date.now() + FIRST_VISIT_DURATION_MS;
    try {
      window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(firstVisitTarget));
    } catch {
      // Ignore storage errors and proceed with in-memory target.
    }
    setTargetMs(firstVisitTarget);
  }, []);

  const { days, hours, mins, secs } = useCountdown(targetMs);
  return (
    <section className="bg-white pb-3 pt-[10px]" aria-label={t("countdownTitle")}>
      <div className="mx-auto max-w-4xl px-3 text-center sm:px-4">
        <div className="w-full bg-[#ecf0f1] px-3 py-3 sm:inline-block sm:h-[135.594px] sm:w-[830px] sm:px-[15px] sm:py-[15px]">
          <div className="grid grid-cols-4 gap-x-1 gap-y-0 sm:gap-0">
            {[
              { v: days, l: "DAYS" },
              { v: hours, l: "HOURS" },
              { v: mins, l: "MINS" },
              { v: secs, l: "SECS" },
            ].map((x) => (
              <div
                key={x.l}
                className="flex min-w-0 flex-col items-center justify-center text-center sm:h-[105.594px] sm:w-[185px]"
              >
                <div className="text-xl font-extrabold tabular-nums leading-none text-ink sm:text-[52px]">
                  {x.v}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase leading-none tracking-wide text-ink/65 sm:mt-2 sm:text-xs">
                  {x.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
