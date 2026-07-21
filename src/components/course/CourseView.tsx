"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { VdoPlayer } from "./VdoPlayer";
import { ProtectedImageLesson } from "./ProtectedImageLesson";
import { useLessonProgress } from "@/hooks/useLessonProgress";

type Lesson = {
  id: string;
  title_ar: string;
  title_en: string;
  type: string;
  order: number;
  vdoId: string | null;
  images: { id: string; order: number }[];
};

type Module = {
  id: string;
  title_ar: string;
  title_en: string;
  order: number;
  lessons: Lesson[];
};

type Props = { modules: Module[]; initialLessonId: string | null };

export function CourseView({ modules, initialLessonId }: Props) {
  const t = useTranslations("course");
  const locale = useLocale();
  const { isComplete, markComplete } = useLessonProgress();
  const flat = useMemo(() => {
    const rows: { module: Module; lesson: Lesson }[] = [];
    for (const m of [...modules].sort((a, b) => a.order - b.order)) {
      for (const l of [...m.lessons].sort((a, b) => a.order - b.order)) {
        rows.push({ module: m, lesson: l });
      }
    }
    return rows;
  }, [modules]);

  const [active, setActive] = useState<string | null>(() => {
    if (initialLessonId && flat.some((f) => f.lesson.id === initialLessonId)) {
      return initialLessonId;
    }
    return flat[0]?.lesson.id ?? null;
  });
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    if (initialLessonId) {
      const row = flat.find((f) => f.lesson.id === initialLessonId);
      if (row) return { [row.module.id]: true };
    }
    if (flat[0]) return { [flat[0].module.id]: true };
    return {};
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const current = flat.find((f) => f.lesson.id === active)?.lesson ?? null;
  const title = (l: Lesson) => (locale === "ar" ? l.title_ar : l.title_en);
  const mtitle = (m: Module) => (locale === "ar" ? m.title_ar : m.title_en);

  const ensureOpen = useCallback((moduleId: string) => {
    setOpen((o) => ({ ...o, [moduleId]: true }));
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Image lessons: mark complete when opened.
  useEffect(() => {
    if (current?.type === "images") {
      markComplete(current.id);
    }
  }, [current, markComplete]);

  const moduleComplete = (m: Module) =>
    m.lessons.length > 0 && m.lessons.every((l) => isComplete(l.id));

  return (
    <div className="relative flex min-h-screen bg-white">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close modules menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/35 md:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 start-0 z-40 w-[86%] max-w-xs bg-white border-e border-zinc-200 transition-transform duration-300",
          "md:static md:inset-auto md:z-auto md:h-screen md:w-full md:max-w-xs md:translate-x-0 md:overflow-y-auto md:sticky md:top-0",
          mobileMenuOpen
            ? "max-md:translate-x-0"
            : "max-md:ltr:-translate-x-full max-md:rtl:translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-3 md:block md:border-b-0 md:p-0">
          <h2 className="text-lg font-medium text-ink md:hidden">{t("modules")}</h2>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-ink/70 md:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="p-2">
          {modules
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <div key={m.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-start text-sm font-medium text-ink hover:bg-white"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {moduleComplete(m) ? (
                      <span
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EC750C] text-[11px] font-bold text-white"
                        aria-label={t("completed")}
                        title={t("completed")}
                      >
                        ✓
                      </span>
                    ) : null}
                    <span className="truncate">{mtitle(m)}</span>
                  </span>
                  <span className="shrink-0 text-zinc-400">{open[m.id] ? "−" : "+"}</span>
                </button>
                {open[m.id] && (
                  <ul className="ms-1 border-s-2 border-[#EC750C]/25 ps-1">
                    {m.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((l) => {
                        const done = isComplete(l.id);
                        return (
                          <li key={l.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setActive(l.id);
                                ensureOpen(m.id);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm ${
                                active === l.id
                                  ? "bg-white font-semibold text-[#EC750C] ring-1 ring-[#EC750C]/25"
                                  : "text-ink/80 hover:bg-white/80"
                              }`}
                            >
                              <span
                                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                  done
                                    ? "bg-[#EC750C] text-white"
                                    : "border border-zinc-300 text-transparent"
                                }`}
                                aria-hidden={!done}
                                title={done ? t("completed") : undefined}
                              >
                                ✓
                              </span>
                              <span className="min-w-0 flex-1">{title(l)}</span>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            ))}
        </nav>
      </aside>
      <main className="min-h-screen flex-1 p-4 md:p-8">
        <div className="mb-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-ink"
          >
            <span aria-hidden="true">☰</span>
            {t("modules")}
          </button>
        </div>
        {!current && <p className="text-ink/70">{t("selectLesson")}</p>}
        {current && current.type === "video" && current.vdoId && (
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-ink">
              {isComplete(current.id) ? (
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EC750C] text-sm text-white"
                  aria-label={t("completed")}
                >
                  ✓
                </span>
              ) : null}
              {title(current)}
            </h1>
            <div className="mt-4 max-w-4xl">
              <VdoPlayer
                key={current.vdoId}
                videoId={current.vdoId}
                lessonId={current.id}
                onWatched={markComplete}
              />
            </div>
          </div>
        )}
        {current && current.type === "images" && (
          <ProtectedImageLesson images={current.images} lessonTitle={title(current)} />
        )}
        {current && current.type === "video" && !current.vdoId && (
          <p className="text-sm text-amber-800">Video id missing (configure VdoCipher and seed data).</p>
        )}
      </main>
    </div>
  );
}
