import { NextResponse } from "next/server";

import {
  createSessionToken,
  hashPassword,
  sessionCookieName,
  type UserRole,
} from "@/lib/auth";
import { verifyOtpChallenge } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    otp?: string;
    challenge?: string;
    purpose?: "login" | "password-reset";
    newPassword?: string;
  };
  const email = body.email?.trim().toLowerCase();
  const otp = body.otp?.trim() ?? "";
  const purpose = body.purpose ?? "login";

  if (!email || !otp || !body.challenge) {
    return NextResponse.json(
      { message: "Email, OTP, and challenge are required." },
      { status: 400 },
    );
  }

  if (
    !verifyOtpChallenge({
      challenge: body.challenge,
      email,
      otp,
      purpose,
    })
  ) {
    return NextResponse.json(
      { message: "Invalid or expired OTP." },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ message: "Account not found." }, { status: 404 });
  }

  if (purpose === "password-reset") {
    const newPassword = body.newPassword ?? "";

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  }

  const role = user.role as UserRole;
  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
  });

  response.cookies.set(
    sessionCookieName,
    createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );

  return response;
}
