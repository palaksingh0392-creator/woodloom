import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  orderStatuses,
  paymentStatuses,
  trackingStatusLabels,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/order-status";
import { applyOrderInventoryTransition } from "@/lib/inventory";
import { calculateOrderPaymentBreakdown } from "@/lib/payment-breakdown";
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
    refundTransactionId?: string;
  };
  const status = body.status;
  const paymentStatus = body.paymentStatus;
  const refundTransactionId = body.refundTransactionId?.trim();

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

  if (paymentStatus === "REFUNDED" && !refundTransactionId) {
    return NextResponse.json({ message: "Refund transaction ID is required." }, { status: 400 });
  }

  const { id } = await context.params;

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const currentOrder = await transaction.order.findUnique({
        where: { id },
        include: { items: true, payment: true },
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

      const breakdown =
        paymentStatus === "PAID"
          ? calculateOrderPaymentBreakdown(Number(currentOrder.total), "FULL", Number(currentOrder.total))
          : paymentStatus === "PARTIALLY_PAID"
            ? calculateOrderPaymentBreakdown(Number(currentOrder.total), "PARTIAL", Math.ceil(Number(currentOrder.total) * 0.3))
            : { paidAmount: undefined, dueAmount: undefined };

      const paidAmount = breakdown.paidAmount;
      const dueAmount = breakdown.dueAmount;

      const updatedOrder = await transaction.order.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(paidAmount !== undefined ? { paidAmount } : {}),
          ...(dueAmount !== undefined ? { dueAmount } : {}),
        },
      });

      if (paymentStatus) {
        await transaction.payment.updateMany({
          where: { orderId: id },
          data: {
            status: paymentStatus,
            paidAt: paymentStatus === "PAID" ? new Date() : null,
            ...(paymentStatus === "PAID"
              ? { amount: currentOrder.total, outstandingAmount: 0 }
              : {}),
            ...(paymentStatus === "REFUNDED" ? { providerRefundId: refundTransactionId } : {}),
          },
        });
      }

      if (status && status !== currentOrder.status) {
        await transaction.orderTrackingEvent.create({
          data: {
            orderId: id,
            status,
            label: trackingStatusLabels[status] ?? "Order status updated",
            notes: `Status changed from ${currentOrder.status} to ${status}.`,
          },
        });
      }

      if (status === "RETURNED") {
        await transaction.returnRequest.updateMany({
          where: { orderId: id },
          data: { status: "APPROVED" },
        });
      }

      if (status === "CANCELLED" && currentOrder.status === "RETURN_REQUESTED") {
        await transaction.returnRequest.updateMany({
          where: { orderId: id },
          data: { status: "REJECTED" },
        });
      }

      return updatedOrder;
    }, { maxWait: 10000, timeout: 60000 });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }
}
