import { NextRequest, NextResponse } from "next/server";
import { getCourseAccess } from "@/lib/course-access";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const access = await getCourseAccess();
  if (!access.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json({ error: "videoId required" }, { status: 400 });
  }
  const key = process.env.VDOCIPHER_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "VdoCipher not configured" }, { status: 500 });
  }
  const res = await fetch(
    `https://dev.vdocipher.com/api/videos/${encodeURIComponent(videoId)}/otp`,
    {
      method: "POST",
      headers: {
        Authorization: `Apisecret ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: 300 }),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    console.error("VdoCipher error", t);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
  const data = (await res.json()) as { otp?: string; playbackInfo?: string; data?: { otp?: string; playbackInfo?: string } };
  const otp = data.otp || data.data?.otp;
  const playbackInfo = data.playbackInfo || data.data?.playbackInfo;
  if (!otp) {
    return NextResponse.json({ error: "Bad upstream response" }, { status: 502 });
  }
  return NextResponse.json({ otp, playbackInfo: playbackInfo ?? null });
}
