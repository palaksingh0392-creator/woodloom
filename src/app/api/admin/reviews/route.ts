import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import { listAdminProductReviews } from "@/lib/reviews";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 401 },
    );
  }

  return NextResponse.json({ reviews: await listAdminProductReviews() });
}
