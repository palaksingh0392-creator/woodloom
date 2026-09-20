import { NextResponse } from "next/server";

import { isValidEmail, normalizeEmail } from "@/lib/account-validation";
import { hasDatabaseUrl } from "@/lib/auth";
import { createOtpChallenge } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return NextResponse.json(
        { message: "Database connection is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      email?: string;
      purpose?: "login" | "password-reset" | "signup";
    };
    const email = normalizeEmail(body.email ?? "");
    const purpose = body.purpose ?? "login";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (purpose === "signup") {
      if (user) {
        return NextResponse.json(
          { message: "An account already exists with this email address." },
          { status: 409 },
        );
      }
    } else if (!user || user.status !== "ACTIVE") {
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
  } catch (error) {
    console.error("OTP request failed:", error);

    return NextResponse.json(
      {
        message: "Verification could not be sent. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
