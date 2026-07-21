"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthState = "loading" | "guest" | "member" | "buyer";

type AuthContextValue = {
  authState: AuthState;
  refreshAuth: () => Promise<void>;
};

const AuthStateContext = createContext<AuthContextValue | null>(null);

async function loadAuthState(): Promise<AuthState> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return "guest";

  const data = (await res.json()) as {
    user?: { id?: string } | null;
    access?: { status?: string; expiresAt?: string } | null;
  };

  if (!data.user?.id) return "guest";

  const active =
    data.access?.status === "active" && data.access?.expiresAt
      ? new Date(data.access.expiresAt).getTime() > Date.now()
      : false;

  return active ? "buyer" : "member";
}

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("loading");

  const refreshAuth = async () => {
    try {
      const next = await loadAuthState();
      setAuthState(next);
    } catch {
      setAuthState("guest");
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ authState, refreshAuth }), [authState]);

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>;
}

export function useAuthState() {
  const ctx = useContext(AuthStateContext);
  if (!ctx) {
    throw new Error("useAuthState must be used within AuthStateProvider");
  }
  return ctx;
}
