import { NextResponse } from "next/server";

import { verifyAccountRazorpayPayment } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";
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
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (
      !body.orderNumber ||
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature
    ) {
      return NextResponse.json(
        { message: "Payment verification details are incomplete." },
        { status: 400 },
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { message: "Payment signature verification failed." },
        { status: 400 },
      );
    }

    const order = await verifyAccountRazorpayPayment({
      userId: session.id,
      orderNumber: body.orderNumber,
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        deliveryCharge: Number(order.shippingFee),
        total: Number(order.total),
        paidAmount: Number(order.paidAmount),
        dueAmount: Number(order.dueAmount),
        paymentPlan: order.paymentPlan,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Payment could not be verified.",
      },
      { status: 400 },
    );
  }
}
