import { NextResponse } from "next/server";

import { isValidEmail, normalizeEmail } from "@/lib/account-validation";
import { hasDatabaseUrl } from "@/lib/auth";
import { createOtpChallenge } from "@/lib/otp";
import { prisma, withDatabaseTimeout } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return NextResponse.json({ message: "Database connection is not configured yet." }, { status: 503 });
    }

    const body = (await request.json()) as { email?: string };
    const email = normalizeEmail(body.email ?? "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const existingUser = await withDatabaseTimeout(
      "Account lookup",
      () => prisma.user.findUnique({ where: { email } }),
      35000,
    );
    if (existingUser) {
      return NextResponse.json({ message: "An account already exists with this email address." }, { status: 409 });
    }

    const verification = await createOtpChallenge({
      email,
      purpose: "signup",
    });
    return NextResponse.json({
      message: verification.delivered
        ? "Verification code sent. Check your email."
        : "Email delivery is not configured. Check the local development response for the code.",
      expiresAt: verification.expiresAt,
      challenge: verification.challenge,
      devOtp: verification.devOtp,
    });
  } catch (error) {
    console.error("Email verification link request failed:", error);

    if (isDatabaseConnectionError(error)) {
      return NextResponse.json(
        { message: "The account service is temporarily unavailable. Please try again when the database is online." },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: "Verification link could not be sent. Please try again." }, { status: 500 });
  }
}

function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return /failed to connect|can't reach database|database server|database temporarily unavailable|timed out/i.test(
    message,
  );
}
