import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  deleteAdminProductReview,
  updateAdminProductReview,
} from "@/lib/reviews";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type ReviewRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: ReviewRouteContext) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    await updateAdminProductReview(id, await request.json());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not update review.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: ReviewRouteContext) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    await deleteAdminProductReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not delete review.",
      },
      { status: 400 },
    );
  }
}
