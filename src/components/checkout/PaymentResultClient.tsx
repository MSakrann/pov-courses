"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthState } from "@/components/auth/AuthStateProvider";

type Props = {
  initialStatus: "success" | "pending" | "failed" | "error";
  orderId: string | null;
};

type AccessPayload = {
  access?: { status: string; expiresAt: string } | null;
};

export function PaymentResultClient({ initialStatus, orderId }: Props) {
  const t = useTranslations("checkout.result");
  const { refreshAuth } = useAuthState();
  const [status, setStatus] = useState(initialStatus);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (initialStatus === "success") {
      void refreshAuth();
    }
  }, [initialStatus, refreshAuth]);

  useEffect(() => {
    if (status !== "pending") return;

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 12;
    let timer: number | undefined;

    const tick = async () => {
      attempt += 1;
      if (!cancelled) setTries(attempt);
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as AccessPayload;
        if (cancelled) return;
        const access = data.access;
        const active =
          access?.status === "active" &&
          !!access.expiresAt &&
          new Date(access.expiresAt).getTime() > Date.now();
        if (active) {
          setStatus("success");
          await refreshAuth();
          return;
        }
      } catch {
        // keep polling
      }
      if (!cancelled && attempt < maxAttempts) {
        timer = window.setTimeout(tick, 2500);
      }
    };

    void tick();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [status, refreshAuth]);

  if (status === "success") {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-ink">{t("successTitle")}</h1>
        <p className="text-ink/80">{t("successBody")}</p>
        {orderId ? (
          <p className="text-sm text-ink/50">
            {t("orderRef")}: {orderId}
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/course"
            className="rounded-full bg-brand-red px-8 py-3 font-bold text-white"
          >
            {t("openCourse")}
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-zinc-300 px-8 py-3 font-bold text-ink"
          >
            {t("openProfile")}
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-ink">{t("pendingTitle")}</h1>
        <p className="text-ink/80">{t("pendingBody")}</p>
        <p className="text-sm text-ink/50">{t("pendingWait", { n: tries })}</p>
        <Link href="/profile" className="inline-block text-brand-red underline">
          {t("openProfile")}
        </Link>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-ink">{t("failedTitle")}</h1>
        <p className="text-ink/80">{t("failedBody")}</p>
        <Link
          href="/checkout"
          className="inline-block rounded-full bg-brand-red px-8 py-3 font-bold text-white"
        >
          {t("tryAgain")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-extrabold text-ink">{t("errorTitle")}</h1>
      <p className="text-ink/80">{t("errorBody")}</p>
      <Link
        href="/checkout"
        className="inline-block rounded-full bg-brand-red px-8 py-3 font-bold text-white"
      >
        {t("tryAgain")}
      </Link>
    </div>
  );
}
