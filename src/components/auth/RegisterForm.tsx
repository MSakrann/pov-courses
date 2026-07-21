"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthState } from "./AuthStateProvider";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { refreshAuth } = useAuthState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      await refreshAuth();
      router.push("/checkout");
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
        <label className="text-sm font-medium text-ink">{t("name")}</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">{t("confirmPassword")}</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          type="password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-red py-3 font-bold text-white disabled:opacity-50"
      >
        {t("submitRegister")}
      </button>
      <p className="text-center text-sm text-ink/70">
        <Link className="text-brand-red underline" href="/login">
          {t("toLogin")}
        </Link>
      </p>
    </form>
  );
}
