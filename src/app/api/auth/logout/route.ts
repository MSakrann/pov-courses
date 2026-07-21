import { NextResponse } from "next/server";
import { authCookieBase, clearAuthCookie } from "@/lib/auth-cookies";
import { AUTH_COOKIE } from "@/lib/constants";

export async function POST() {
  await clearAuthCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", { ...authCookieBase, maxAge: 0 });
  return response;
}
