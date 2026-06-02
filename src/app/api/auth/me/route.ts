import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sessionCookieName, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifySessionToken(
    cookieStore.get(sessionCookieName)?.value,
  );

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
  });
}
