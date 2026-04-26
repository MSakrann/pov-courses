import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./constants";
import { createAuthToken, verifyAuthToken } from "./jwt";

const cookieBase = {
  path: "/",
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setAuthCookie(userId: string, email: string) {
  const token = await createAuthToken(userId, email);
  cookies().set(AUTH_COOKIE, token, cookieBase);
}

export async function clearAuthCookie() {
  cookies().set(AUTH_COOKIE, "", { ...cookieBase, maxAge: 0 });
}

export async function getSessionFromCookies() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}
