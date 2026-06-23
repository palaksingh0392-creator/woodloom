import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import { updateAdminNewsletterSubscriber } from "@/lib/customer-messages";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type SubscriberRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: SubscriberRouteContext,
) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    await updateAdminNewsletterSubscriber(id, await request.json());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not update subscriber.",
      },
      { status: 400 },
    );
  }
}
