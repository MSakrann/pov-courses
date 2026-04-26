import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { readFile, stat } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCourseAccess } from "@/lib/course-access";
import { getPrivateImagesPath } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

export async function GET(request: NextRequest) {
  const access = await getCourseAccess();
  if (!access.ok) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return new NextResponse("Bad request", { status: 400 });
  }
  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }
  const base = path.resolve(getPrivateImagesPath());
  const filePath = path.resolve(base, image.filename);
  if (!filePath.startsWith(base + path.sep) && filePath !== base) {
    return new NextResponse("Invalid path", { status: 400 });
  }
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return new NextResponse("Not allowed", { status: 400 });
  }
  if (!existsSync(filePath)) {
    return new NextResponse("Missing file", { status: 404 });
  }
  const st = await stat(filePath);
  const buf = await readFile(filePath);
  const type =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "application/octet-stream";
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Length": String(st.size),
      "Content-Disposition": "inline",
      "Cache-Control": "no-store",
    },
  });
}
