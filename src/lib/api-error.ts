import { NextResponse } from "next/server";

type PrismaLikeError = {
  code?: string;
  message?: string;
  name?: string;
};

/** Map known failures to a safe diagnostic code for production debugging. */
export function diagnoseServerError(error: unknown): {
  status: number;
  error: string;
  code: string;
} {
  const err = error as PrismaLikeError;
  const message = typeof err?.message === "string" ? err.message : String(error);
  const prismaCode = typeof err?.code === "string" ? err.code : "";

  if (message.includes("JWT_SECRET")) {
    return { status: 500, error: "Server misconfigured", code: "JWT_SECRET_MISSING" };
  }

  // Table / schema missing — Neon connected but prisma db push never run
  if (
    prismaCode === "P2021" ||
    prismaCode === "P2010" ||
    /does not exist|relation .* does not exist/i.test(message)
  ) {
    return {
      status: 500,
      error: "Database schema not initialized",
      code: "DB_SCHEMA_MISSING",
    };
  }

  if (
    prismaCode === "P1001" ||
    prismaCode === "P1000" ||
    prismaCode === "P1010" ||
    /Can't reach database|denied access|connection/i.test(message)
  ) {
    return {
      status: 500,
      error: "Database connection failed",
      code: "DB_CONNECTION",
    };
  }

  if (/bcrypt|Invalid salt|data and hash/i.test(message)) {
    return { status: 500, error: "Password hashing failed", code: "BCRYPT_ERROR" };
  }

  return { status: 500, error: "Server error", code: "UNKNOWN" };
}

export function serverErrorResponse(error: unknown) {
  console.error("[api]", error);
  const diagnosed = diagnoseServerError(error);
  return NextResponse.json(
    { error: diagnosed.error, code: diagnosed.code },
    { status: diagnosed.status },
  );
}
