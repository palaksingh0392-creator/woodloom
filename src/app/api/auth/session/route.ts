import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ user: await getCurrentSession() });
}