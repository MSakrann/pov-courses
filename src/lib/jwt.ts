import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { AUTH_COOKIE } from "./constants";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
};

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
};

function parseExpires(): string | number {
  const raw = process.env.JWT_EXPIRES_IN || "7d";
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  return raw;
}

export async function createAuthToken(userId: string, email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(parseExpires())
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  if (!payload.sub || typeof payload.email !== "string") {
    return null;
  }
  return payload as SessionPayload;
}

export function getAuthCookieName() {
  return AUTH_COOKIE;
}
