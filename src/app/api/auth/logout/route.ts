import { NextResponse } from "next/server";
import { authCookieBase } from "@/lib/auth-cookies";
import { AUTH_COOKIE } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", { ...authCookieBase, maxAge: 0 });
  return response;
}
