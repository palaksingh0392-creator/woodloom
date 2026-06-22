import { NextResponse } from "next/server";

import {
  cancelAccountOrder,
  requestAccountReturn,
} from "@/lib/orders";
import { getCurrentSession } from "@/lib/session";

type RouteContext = { params: Promise<{ orderNumber: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await context.params;
  const body = (await request.json()) as {
    action?: "cancel" | "return";
    reason?: string;
    notes?: string;
  };

  try {
    if (body.action === "cancel") {
      const order = await cancelAccountOrder(session.id, orderNumber);
      return NextResponse.json({ order });
    }

    if (body.action === "return") {
      const order = await requestAccountReturn({
        userId: session.id,
        orderNumber,
        reason: body.reason ?? "",
        notes: body.notes,
      });
      return NextResponse.json({ order });
    }

    return NextResponse.json(
      { message: "Choose a valid order action." },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not update order.",
      },
      { status: 400 },
    );
  }
}
