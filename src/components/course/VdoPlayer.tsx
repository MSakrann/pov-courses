"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Brand orange (#EC750C) — VdoCipher expects HEX without # */
const PLAYER_PRIMARY_COLOR = "EC750C";

type Props = {
  videoId: string;
  lessonId: string;
  onWatched?: (lessonId: string) => void;
};

function isVdoCipherOrigin(origin: string) {
  return (
    origin === "https://player.vdocipher.com" ||
    origin.endsWith(".vdocipher.com")
  );
}

function extractEventName(data: unknown): string | null {
  if (typeof data === "string") {
    try {
      return extractEventName(JSON.parse(data));
    } catch {
      return data.toLowerCase();
    }
  }
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const candidates = [o.event, o.type, o.name, o.action, o.message];
  for (const c of candidates) {
    if (typeof c === "string" && c) return c.toLowerCase();
  }
  return null;
}

function extractProgressRatio(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const nested =
    o.data && typeof o.data === "object"
      ? (o.data as Record<string, unknown>)
      : o;
  const current =
    typeof nested.currentTime === "number"
      ? nested.currentTime
      : typeof nested.time === "number"
        ? nested.time
        : null;
  const duration =
    typeof nested.duration === "number"
      ? nested.duration
      : typeof nested.totalDuration === "number"
        ? nested.totalDuration
        : null;
  if (current != null && duration != null && duration > 0) {
    return current / duration;
  }
  if (typeof nested.percent === "number") return nested.percent / 100;
  if (typeof nested.progress === "number") {
    return nested.progress > 1 ? nested.progress / 100 : nested.progress;
  }
  return null;
}

export function VdoPlayer({ videoId, lessonId, onWatched }: Props) {
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

  // Mark lesson complete from player events (play / significant progress / ended).
  useEffect(() => {
    if (!data || !onWatched) return;

    let marked = false;
    let playTimer: number | undefined;

    const mark = () => {
      if (marked) return;
      marked = true;
      onWatched(lessonId);
    };

    const onMessage = (event: MessageEvent) => {
      if (!isVdoCipherOrigin(event.origin)) return;
      const name = extractEventName(event.data);
      const ratio = extractProgressRatio(event.data);

      if (
        name === "ended" ||
        name === "video.ended" ||
        name === "complete" ||
        name === "completed"
      ) {
        mark();
        return;
      }

      if (ratio != null && ratio >= 0.8) {
        mark();
        return;
      }

      if (
        name === "play" ||
        name === "playing" ||
        name === "video.play" ||
        name === "timeupdate" ||
        name === "progress"
      ) {
        if (!playTimer) {
          playTimer = window.setTimeout(mark, 8000);
        }
      }
    };

    window.addEventListener("message", onMessage);
    // Fallback: if player loaded and stayed open ~45s, count as watched.
    const fallback = window.setTimeout(mark, 45000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
      if (playTimer) window.clearTimeout(playTimer);
    };
  }, [data, lessonId, onWatched]);

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
  src.searchParams.set("primaryColor", PLAYER_PRIMARY_COLOR);

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
