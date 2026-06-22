import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  canAccessAdmin,
  sessionCookieName,
  verifySessionToken,
} from "@/lib/auth";

export async function getCurrentSession() {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
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
