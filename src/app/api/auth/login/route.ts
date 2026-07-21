import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { authCookieBase, createSessionToken } from "@/lib/auth-cookies";
import { AUTH_COOKIE } from "@/lib/constants";
import { limitLoginRequest } from "@/lib/rate-limit";
import { serverErrorResponse } from "@/lib/api-error";

function getClientIp(request: NextRequest) {
  const h = request.headers.get("x-forwarded-for");
  if (h) return h.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = await limitLoginRequest(`login:${ip}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = await createSessionToken(user.id, user.email);
    const purchase = await prisma.purchase.findUnique({ where: { userId: user.id } });
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, lang: user.lang },
      access: purchase
        ? {
            status: purchase.status,
            expiresAt: purchase.expiresAt.toISOString(),
          }
        : null,
    });
    response.cookies.set(AUTH_COOKIE, token, authCookieBase);
    return response;
  } catch (e) {
    return serverErrorResponse(e);
  }
}
