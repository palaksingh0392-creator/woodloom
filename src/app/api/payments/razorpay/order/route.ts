import { NextResponse } from "next/server";

import { createAccountOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, getRazorpayConfig } from "@/lib/razorpay";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Login is required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const preliminaryOrder = await createAccountOrder({
      userId: session.id,
      items: body.items,
      address: body.address,
      addressId: body.addressId,
      paymentMethod: "razorpay",
      paymentPlan: body.paymentPlan,
    });

    if (!preliminaryOrder) {
      return NextResponse.json(
        { message: "Order database is not configured." },
        { status: 503 },
      );
    }

    const amount = Number(preliminaryOrder.payment?.amount ?? preliminaryOrder.total);
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(amount * 100),
      receipt: preliminaryOrder.orderNumber,
      notes: {
        shissoo_order_number: preliminaryOrder.orderNumber,
        customer_id: session.id,
      },
    });
    const { keyId } = getRazorpayConfig();

    await prisma.payment.update({
      where: { orderId: preliminaryOrder.id },
      data: { providerOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      keyId,
      orderNumber: preliminaryOrder.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Razorpay order could not be created.",
      },
      { status: 400 },
    );
  }
}
