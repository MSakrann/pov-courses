export const AUTH_COOKIE = "auth-token";

export function getAccessDays(): number {
  const v = process.env.ACCESS_DAYS;
  if (!v) return 180;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 180;
}

export function getPrivateImagesPath(): string {
  return process.env.PRIVATE_IMAGES_PATH || "./private/images";
}
