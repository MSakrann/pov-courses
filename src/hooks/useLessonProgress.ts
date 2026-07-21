"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "pov-course-completed:";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function writeSet(key: string, ids: Set<string>) {
  window.localStorage.setItem(key, JSON.stringify(Array.from(ids)));
}

/**
 * Tracks completed lesson IDs in localStorage, scoped to the logged-in user when available.
 */
export function useLessonProgress() {
  const storageKeyRef = useRef(`${STORAGE_PREFIX}anon`);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let key = `${STORAGE_PREFIX}anon`;
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { user?: { id?: string } | null };
        if (data.user?.id) key = `${STORAGE_PREFIX}${data.user.id}`;
      } catch {
        // keep anon key
      }
      if (cancelled) return;
      storageKeyRef.current = key;
      setCompleted((prev) => {
        const stored = readSet(key);
        if (prev.size === 0) return stored;
        const merged = new Set(Array.from(stored).concat(Array.from(prev)));
        writeSet(key, merged);
        return merged;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markComplete = useCallback((lessonId: string) => {
    if (!lessonId) return;
    setCompleted((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      writeSet(storageKeyRef.current, next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (lessonId: string) => completed.has(lessonId),
    [completed]
  );

  return { completed, markComplete, isComplete };
}
