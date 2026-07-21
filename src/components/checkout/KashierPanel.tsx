"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";

type IframeConfig = {
  scriptSrc: string;
  attrs: Record<string, string>;
};

export function KashierPanel() {
  const t = useTranslations("checkout");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [iframeConfig, setIframeConfig] = useState<IframeConfig | null>(null);

  const start = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/pending", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || t("initError"));
        return;
      }
      setOrderId(String(data.kashierOrderId));
      if (data.iframe?.scriptSrc && data.iframe?.attrs) {
        setIframeConfig(data.iframe as IframeConfig);
      } else {
        setErr(t("initError"));
      }
    } catch {
      setErr(t("initError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const hostedPaymentUrl = useMemo(() => {
    if (!iframeConfig) return null;
    const modeBase =
      iframeConfig.attrs["data-mode"] === "live"
        ? "https://iframe.kashier.io"
        : "https://test-iframe.kashier.io";
    const params = new URLSearchParams({
      mid: iframeConfig.attrs["data-merchantId"] || "",
      orderId: iframeConfig.attrs["data-orderId"] || "",
      amount: iframeConfig.attrs["data-amount"] || "",
      currency: iframeConfig.attrs["data-currency"] || "",
      hash: iframeConfig.attrs["data-hash"] || "",
      merchantRedirect: iframeConfig.attrs["data-merchantRedirect"] || "",
    });
    return `${modeBase}/payment?${params.toString()}`;
  }, [iframeConfig]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">{t("kashierNote")}</p>
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="w-full rounded-full bg-brand-red py-3 font-bold text-white disabled:opacity-50"
      >
        {t("pay")}
        {loading ? "…" : ""}
      </button>
      {err && <p className="text-sm text-brand-red">{err}</p>}
      {orderId && iframeConfig && (
        <div className="space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-ink/80">
          <p>
            <span className="font-semibold text-ink">Order ref: </span>
            {orderId}
          </p>
          <Script
            id="kashier-iFrame"
            src={iframeConfig.scriptSrc}
            strategy="afterInteractive"
            data-amount={iframeConfig.attrs["data-amount"]}
            data-description={iframeConfig.attrs["data-description"]}
            data-hash={iframeConfig.attrs["data-hash"]}
            data-currency={iframeConfig.attrs["data-currency"]}
            data-orderId={iframeConfig.attrs["data-orderId"]}
            data-merchantId={iframeConfig.attrs["data-merchantId"]}
            data-merchantRedirect={iframeConfig.attrs["data-merchantRedirect"]}
            data-store={iframeConfig.attrs["data-store"]}
            data-type={iframeConfig.attrs["data-type"]}
            data-display={iframeConfig.attrs["data-display"]}
            data-allowedMethods={iframeConfig.attrs["data-allowedMethods"]}
            data-mode={iframeConfig.attrs["data-mode"]}
          />
          {hostedPaymentUrl && (
            <p className="text-xs">
              If popup blockers prevent opening Kashier, open directly:{" "}
              <a
                className="text-brand-red underline"
                href={hostedPaymentUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open secure checkout
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
