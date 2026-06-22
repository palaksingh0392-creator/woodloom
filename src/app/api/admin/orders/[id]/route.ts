import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  orderStatuses,
  paymentStatuses,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/order-status";
import { applyOrderInventoryTransition } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  };
  const status = body.status;
  const paymentStatus = body.paymentStatus;

  if (
    (status && !orderStatuses.includes(status)) ||
    (paymentStatus && !paymentStatuses.includes(paymentStatus))
  ) {
    return NextResponse.json(
      { message: "Choose a valid order and payment status." },
      { status: 400 },
    );
  }

  if (!status && !paymentStatus) {
    return NextResponse.json(
      { message: "No order changes were provided." },
      { status: 400 },
    );
  }

  const { id } = await context.params;

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const currentOrder = await transaction.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!currentOrder) {
        throw new Error("Order not found.");
      }

      if (status && status !== currentOrder.status) {
        await applyOrderInventoryTransition(
          transaction,
          currentOrder.items,
          currentOrder.status,
          status,
        );
      }

      const updatedOrder = await transaction.order.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
        },
      });

      if (paymentStatus) {
        await transaction.payment.updateMany({
          where: { orderId: id },
          data: {
            status: paymentStatus,
            paidAt: paymentStatus === "PAID" ? new Date() : null,
          },
        });
      }

      return updatedOrder;
    });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }
}
