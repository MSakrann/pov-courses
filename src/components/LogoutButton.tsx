"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuthState } from "./auth/AuthStateProvider";

export function LogoutButton({ label }: { label?: string }) {
  const router = useRouter();
  const { refreshAuth } = useAuthState();
  const t = useTranslations("auth");
  const text = label ?? t("logout");
  return (
    <button
      type="button"
      className="text-sm text-ink/70 underline transition-colors hover:text-brand-red"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        await refreshAuth();
        router.push("/");
        router.refresh();
      }}
    >
      {text}
    </button>
  );
}
