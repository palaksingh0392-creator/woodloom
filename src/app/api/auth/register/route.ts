import { NextResponse } from "next/server";

import {
  createSessionToken,
  hashPassword,
  hasDatabaseUrl,
  sessionCookieName,
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
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  };
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || null;
  const password = body.password ?? "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { message: "Name, valid email, and 8+ character password are required." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "An account already exists with these details." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });

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
}
