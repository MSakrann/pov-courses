"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthState } from "./AuthStateProvider";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { refreshAuth } = useAuthState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      const access = data.access as
        | { status: string; expiresAt: string }
        | null
        | undefined;
      const now = Date.now();
      const active =
        access?.status === "active" && access?.expiresAt
          ? new Date(access.expiresAt).getTime() > now
          : false;
      await refreshAuth();
      router.push(active ? "/profile" : "/checkout");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      {error && (
        <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="text-sm font-medium text-ink">{t("email")}</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">{t("password")}</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-red py-3 font-bold text-white disabled:opacity-50"
      >
        {t("submitLogin")}
      </button>
      <p className="text-center text-sm text-ink/70">
        <Link className="text-brand-red underline" href="/register">
          {t("toRegister")}
        </Link>
      </p>
    </form>
  );
}
