"use client";

import { useRouter } from "@/i18n/navigation";

export function LogoutButton({ label = "Logout" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm text-ink/70 underline"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
