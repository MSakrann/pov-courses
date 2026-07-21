"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Props = { videoId: string };

export function VdoPlayer({ videoId }: Props) {
  const t = useTranslations("course");
  const [data, setData] = useState<{ otp: string; playbackInfo: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/vdocipher/otp?videoId=${encodeURIComponent(videoId)}`);
        const j = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setData(null);
          setError(String(j.error || "load"));
          return;
        }
        setError(null);
        setData({ otp: j.otp, playbackInfo: j.playbackInfo ?? null });
      } catch {
        if (cancelled) return;
        setData(null);
        setError("load");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  if (error) {
    return <p className="text-sm text-brand-red">{error}</p>;
  }
  if (!data) {
    return <p className="text-ink/70">{t("videoLoading")}</p>;
  }
  const src = new URL("https://player.vdocipher.com/v2/");
  src.searchParams.set("otp", data.otp);
  if (data.playbackInfo) {
    src.searchParams.set("playbackInfo", data.playbackInfo);
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-200 bg-black">
      <iframe
        key={videoId}
        title="Lesson video"
        className="h-full w-full"
        allow="encrypted-media; autoplay; fullscreen"
        allowFullScreen
        src={src.toString()}
      />
    </div>
  );
}
