import { NextResponse } from "next/server";

import { hasDatabaseUrl } from "@/lib/auth";
import { createOtpChallenge } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    purpose?: "login" | "password-reset";
  };
  const email = body.email?.trim().toLowerCase();
  const purpose = body.purpose ?? "login";

  if (!email) {
    return NextResponse.json({ message: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json(
      { message: "No active account found for this email." },
      { status: 404 },
    );
  }

  const challenge = await createOtpChallenge({ email, purpose });

  return NextResponse.json({
    message: "OTP sent successfully.",
    ...challenge,
  });
}
