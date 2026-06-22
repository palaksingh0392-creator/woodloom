import { NextResponse } from "next/server";

import {
  canAccessAdmin,
  createSessionToken,
  hasDatabaseUrl,
  sessionCookieName,
  verifyPassword,
  type UserRole,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    portal?: "customer" | "admin";
  };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !user ||
    user.status !== "ACTIVE" ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return NextResponse.json(
      { message: "Invalid login credentials." },
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
}
