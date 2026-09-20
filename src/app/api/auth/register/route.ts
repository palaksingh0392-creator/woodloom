import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
  createSessionToken,
  hashPassword,
  hasDatabaseUrl,
  sessionCookieName,
} from "@/lib/auth";
import {
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  normalizePhone,
} from "@/lib/account-validation";
import { verifyEmailVerificationToken } from "@/lib/email-verification";
import { createAdminNotification } from "@/lib/admin-notifications";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return NextResponse.json(
        { message: "Database connection is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      verificationCode?: string;
      challenge?: string;
      verificationToken?: string;
    };
    const name = body.name?.trim();
    const email = normalizeEmail(body.email ?? "");
    const phone = normalizePhone(body.phone ?? "") || null;
    const password = body.password ?? "";
    const verificationCode = body.verificationCode?.trim() ?? "";
    const challenge = body.challenge ?? "";
    const verificationToken = body.verificationToken ?? "";

    if (!name || !isValidEmail(email) || !isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Name, a valid email, and a strong password (8+ chars, upper/lower/digit) are required.",
        },
        { status: 400 },
      );
    }

    const linkVerified = Boolean(
      verificationToken && verifyEmailVerificationToken(verificationToken, email),
    );

    if ((!challenge || !verificationCode) && !linkVerified) {
      return NextResponse.json(
        { message: "Email verification is required before creating an account." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account already exists with this email address." },
        { status: 409 },
      );
    }

    const { verifyOtpChallenge } = await import("@/lib/otp");
    const isValidCode = linkVerified || verifyOtpChallenge({
      challenge,
      email,
      otp: verificationCode,
      purpose: "signup",
    });

    if (!isValidCode) {
      return NextResponse.json(
        { message: "The verification code is invalid or expired." },
        { status: 401 },
      );
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return NextResponse.json(
          { message: "An account already exists with this phone number." },
          { status: 409 },
        );
      }
    }

    const existingName = await prisma.user.findFirst({
      where: { name: { equals: name } },
      select: { id: true },
    });

    if (existingName) {
      return NextResponse.json(
        { message: "An account already exists with this full name." },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        emailVerifiedAt: new Date(),
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    try {
      await createAdminNotification({
        type: "CUSTOMER",
        title: "New customer account",
        message: `${user.name} created an account.`,
        href: "/admin/customers",
      });
    } catch (error) {
      console.warn("Could not create customer notification:", error);
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(
      sessionCookieName,
      createSessionToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "CUSTOMER",
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
  } catch (error) {
    console.error("Registration failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(", ")
          : String(error.meta?.target ?? "");

        if (target.includes("email")) {
          return NextResponse.json(
            { message: "An account already exists with this email address." },
            { status: 409 },
          );
        }

        if (target.includes("phone")) {
          return NextResponse.json(
            { message: "An account already exists with this phone number." },
            { status: 409 },
          );
        }

        return NextResponse.json(
          { message: "An account already exists with these details." },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Registration server is not working right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
