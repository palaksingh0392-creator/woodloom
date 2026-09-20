import { NextResponse } from "next/server";

import { createAdminNotification } from "@/lib/admin-notifications";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Login is required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      orderNumber?: string;
      transactionReference?: string;
    };
    const orderNumber = body.orderNumber?.trim();
    const transactionReference = body.transactionReference?.trim();

    if (!orderNumber || !transactionReference) {
      return NextResponse.json(
        { message: "Enter the order number and UPI transaction reference." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber, userId: session.id },
      include: { payment: true },
    });

    if (!order || !order.payment || order.payment.method !== "RAZORPAY") {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    if (order.payment.providerPaymentId) {
      return NextResponse.json({ message: "Payment reference already submitted." }, { status: 409 });
    }

    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        providerPaymentId: transactionReference,
        status: "MANUAL_PENDING",
      },
    });

    try {
      await createAdminNotification({
        type: "ORDER",
        title: "Manual payment submitted",
        message: `${order.orderNumber} is waiting for UPI payment verification.`,
        href: `/admin/orders?highlight=${encodeURIComponent(order.orderNumber)}`,
      });
    } catch (error) {
      console.warn("Could not create manual payment notification:", error);
    }

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to submit payment." },
      { status: 400 },
    );
  }
}