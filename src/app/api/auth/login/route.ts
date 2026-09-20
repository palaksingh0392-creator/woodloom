import { NextResponse } from "next/server";

import { normalizePhone } from "@/lib/account-validation";
import {
  canAccessAdmin,
  createSessionToken,
  getLoginLookupCandidates,
  hasCompatiblePasswordHash,
  hasDatabaseUrl,
  resolveLoginIdentifier,
  sessionCookieName,
  verifyPassword,
  type UserRole,
} from "@/lib/auth";
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
      identifier?: string;
      email?: string;
      phone?: string;
      password?: string;
      portal?: "customer" | "admin";
    };
    const { email, phone } = resolveLoginIdentifier(body);
    const password = body.password ?? "";
    const lookupValues = getLoginLookupCandidates(body);

    if ((!email && !phone) || !password) {
      return NextResponse.json(
        { message: "Email or phone and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
          ...lookupValues
            .map((value) => {
              if (value.includes("@")) return { email: value };
              return { phone: normalizePhone(value) || value };
            })
            .filter((condition) => Object.values(condition)[0]),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email/phone or password." },
        { status: 401 },
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "This account is not active. Please contact support." },
        { status: 403 },
      );
    }

    if (!hasCompatiblePasswordHash(user.passwordHash)) {
      return NextResponse.json(
        {
          message:
            "This account password was not created by the app. Please reset it using the email code, then log in again.",
        },
        { status: 409 },
      );
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { message: "Invalid email/phone or password." },
        { status: 401 },
      );
    }

    const role = user.role as UserRole;

    if (body.portal === "admin" && !canAccessAdmin(role)) {
      return NextResponse.json(
        { message: "This account does not have admin access." },
        { status: 403 },
      );
    }

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
  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json(
      { message: "Login server is not working right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
