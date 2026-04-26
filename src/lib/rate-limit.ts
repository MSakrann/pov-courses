import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

let loginRatelimit: Ratelimit | null = null;

if (upstashUrl && upstashToken) {
  try {
    const redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
    loginRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "rl:login",
    });
  } catch {
    // Optional dependency: if Upstash isn't configured/available, allow login requests through.
    loginRatelimit = null;
  }
}

export async function limitLoginRequest(ip: string) {
  if (!loginRatelimit) {
    return { success: true as const, remaining: 999 };
  }
  try {
    return await loginRatelimit.limit(ip);
  } catch {
    // Fail open if Upstash is unreachable/misconfigured.
    return { success: true as const, remaining: 999 };
  }
}
