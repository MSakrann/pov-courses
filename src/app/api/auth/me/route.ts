import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookies } from "@/lib/auth-cookies";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session?.sub) {
    return NextResponse.json({ user: null, access: null });
  }
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return NextResponse.json({ user: null, access: null });
  }
  const purchase = await prisma.purchase.findUnique({ where: { userId: user.id } });
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, lang: user.lang },
    access: purchase
      ? {
          status: purchase.status,
          expiresAt: purchase.expiresAt.toISOString(),
        }
      : null,
  });
}
