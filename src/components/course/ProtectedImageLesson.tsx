"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type ImageRow = { id: string; order: number };

export function ProtectedImageLesson({ images, lessonTitle }: { images: ImageRow[]; lessonTitle: string }) {
  const t = useTranslations("course");

  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", block, { capture: true });
    return () => window.removeEventListener("keydown", block, { capture: true });
  }, []);

  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold text-ink">{lessonTitle}</h2>
      <p className="text-sm text-ink/60">{t("images")}</p>
      <div className="mt-4 space-y-3">
        {[...images]
          .sort((a, b) => a.order - b.order)
          .map((im) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={im.id}
              src={`/api/content/image?id=${encodeURIComponent(im.id)}`}
              alt=""
              onContextMenu={(e) => e.preventDefault()}
              className="protected-lesson-image w-full max-w-4xl select-none rounded-lg shadow"
              draggable={false}
            />
          ))}
      </div>
    </div>
  );
}
