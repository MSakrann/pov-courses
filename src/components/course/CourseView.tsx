"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { VdoPlayer } from "./VdoPlayer";
import { ProtectedImageLesson } from "./ProtectedImageLesson";

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

  const current = flat.find((f) => f.lesson.id === active)?.lesson ?? null;
  const title = (l: Lesson) => (locale === "ar" ? l.title_ar : l.title_en);
  const mtitle = (m: Module) => (locale === "ar" ? m.title_ar : m.title_en);

  const ensureOpen = useCallback((moduleId: string) => {
    setOpen((o) => ({ ...o, [moduleId]: true }));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      <aside className="w-full shrink-0 border-e border-zinc-200 bg-brand-gray/40 md:sticky md:top-0 md:h-screen md:max-w-xs md:overflow-y-auto">
        <div className="p-3">
          <h2 className="text-lg font-extrabold text-ink">{t("modules")}</h2>
        </div>
        <nav className="p-2">
          {modules
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <div key={m.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-start text-sm font-bold text-ink hover:bg-white"
                >
                  {mtitle(m)}
                  <span className="text-zinc-400">{open[m.id] ? "−" : "+"}</span>
                </button>
                {open[m.id] && (
                  <ul className="ms-1 border-s-2 border-brand-red/20 ps-1">
                    {m.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((l) => (
                        <li key={l.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setActive(l.id);
                              ensureOpen(m.id);
                            }}
                            className={`w-full rounded-lg px-2 py-1.5 text-start text-sm ${
                              active === l.id
                                ? "bg-white font-semibold text-brand-red ring-1 ring-brand-red/20"
                                : "text-ink/80 hover:bg-white/80"
                            }`}
                          >
                            {title(l)}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
        </nav>
      </aside>
      <main className="min-h-screen flex-1 p-4 md:p-8">
        {!current && <p className="text-ink/70">{t("selectLesson")}</p>}
        {current && current.type === "video" && current.vdoId && (
          <div>
            <h1 className="text-2xl font-extrabold text-ink">{title(current)}</h1>
            <div className="mt-4 max-w-4xl">
              <VdoPlayer videoId={current.vdoId} />
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
