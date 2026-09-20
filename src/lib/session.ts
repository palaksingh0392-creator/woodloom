import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  canAccessAdmin,
  hasDatabaseUrl,
  sessionCookieName,
  type AuthUser,
  verifySessionToken,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentSession() {
  const cookieStore = await cookies();

  const session = verifySessionToken(cookieStore.get(sessionCookieName)?.value);

  if (!session || !hasDatabaseUrl()) {
    return session;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AuthUser["role"],
  };
}

export async function requireCustomerSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/admin-login");
  }

  if (!canAccessAdmin(session.role)) {
    redirect("/account");
  }

  return session;
}
