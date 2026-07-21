import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authCookieBase, createSessionToken } from "@/lib/auth-cookies";
import { AUTH_COOKIE } from "@/lib/constants";
import { serverErrorResponse } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, lang: "ar" },
    });
    const token = await createSessionToken(user.id, user.email);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, lang: user.lang },
    });
    response.cookies.set(AUTH_COOKIE, token, authCookieBase);
    return response;
  } catch (e) {
    return serverErrorResponse(e);
  }
}
