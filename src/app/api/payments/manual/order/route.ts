import { NextResponse } from "next/server";

import { createAccountOrder } from "@/lib/orders";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Login is required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const order = await createAccountOrder({
      userId: session.id,
      items: body.items,
      address: body.address,
      addressId: body.addressId,
      paymentMethod: "razorpay",
      paymentPlan: body.paymentPlan,
      isManualPayment: true,
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order database is not configured." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        deliveryCharge: Number(order.shippingFee),
        total: Number(order.total),
        amount: Number(order.payment?.amount ?? order.total),
        paidAmount: 0,
        dueAmount: Number(order.total),
        paymentPlan: order.paymentPlan,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create order." },
      { status: 400 },
    );
  }
}