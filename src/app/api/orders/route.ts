import { NextResponse } from "next/server";

import { hasDatabaseUrl } from "@/lib/auth";
import { createAccountOrder, listAccountOrders } from "@/lib/orders";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    orders: await listAccountOrders(session.id),
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const body = await request.json();

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { message: "Order must include at least one item." },
      { status: 400 },
    );
  }

  try {
    const order = await createAccountOrder({
      userId: session.id,
      items: body.items,
      address: body.address,
      addressId: body.addressId,
      paymentMethod: body.paymentMethod,
    });

    return NextResponse.json(
      {
        order: order
          ? {
              orderNumber: order.orderNumber,
              subtotal: Number(order.subtotal),
              deliveryCharge: Number(order.shippingFee),
              total: Number(order.total),
            }
          : null,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to create order.",
      },
      { status: 400 },
    );
  }
}
