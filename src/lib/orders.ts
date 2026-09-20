import "server-only";

import type {
  CartItem,
  CheckoutAddress,
  PaymentMethod,
  PaymentPlan,
} from "@/store/commerce-store";
import { hasDatabaseUrl } from "@/lib/auth";
import { normalizePhone } from "@/lib/account-validation";
import {
  applyOrderInventoryTransition,
  reserveOrderInventory,
} from "@/lib/inventory";
import { findServiceableArea } from "@/lib/delivery-areas";
import { trackingStatusLabels } from "@/lib/order-status";
import { calculateOrderPaymentBreakdown } from "@/lib/payment-breakdown";
import { prisma } from "@/lib/prisma";

export type AccountOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  refundTransactionId?: string | null;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentPlan: string;
  createdAt: string;
  trackingEvents: {
    status: string;
    label: string;
    notes: string;
    createdAt: string;
  }[];
  returnRequest?: {
    status: string;
    reason: string;
    notes: string;
  } | null;
  items: {
    productName: string;
    productCode: string;
    imageUrl?: string | null;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    baseUnitPrice: number;
    variantCharge: number;
    finish?: string;
    grade?: string | null;
  }[];
};

export type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  address?: CheckoutAddress;
  addressId?: string;
  paymentMethod: PaymentMethod;
  paymentPlan?: PaymentPlan;
  providerOrderId?: string;
  isPaymentVerified?: boolean;
  isManualPayment?: boolean;
};

function createOrderNumber() {
  return `WL-${Date.now().toString().slice(-8)}`;
}

export async function createAccountOrder(input: CreateOrderInput) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  if (input.address && !normalizePhone(input.address.phone)) {
    throw new Error("Enter a valid phone number with exactly 10 digits after +91.");
  }

  return prisma.$transaction(async (transaction) => {
    const products = await transaction.product.findMany({
      where: {
        slug: {
          in: input.items.map((item) => item.productSlug),
        },
      },
      include: {
        variants: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    const productBySlug = new Map(
      products.map((product) => [product.slug, product]),
    );
    const orderItems = input.items.map((item) => {
      const product = productBySlug.get(item.productSlug);

      if (!product) {
        throw new Error(`Product not found: ${item.productSlug}`);
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }

      const requestedFinish = item.finish.trim().toLowerCase();
      const requestedGrade = item.grade?.trim().toLowerCase();
      const finishVariants = product.variants.filter((currentVariant) =>
        currentVariant.finish.trim().toLowerCase() === requestedFinish,
      );
      const variant = finishVariants.find((currentVariant) => {
        const finishMatches =
          currentVariant.finish.trim().toLowerCase() === requestedFinish;
        const gradeMatches =
          !requestedGrade ||
          currentVariant.grade?.trim().toLowerCase() === requestedGrade;

        return finishMatches && gradeMatches;
      }) ?? finishVariants.find((currentVariant) => !currentVariant.grade?.trim()) ?? finishVariants[0];

      if (!variant) {
        const availableFinishes = Array.from(
          new Set(product.variants.map((currentVariant) => currentVariant.finish)),
        ).join(", ");
        throw new Error(
          `Finish "${item.finish}" not found for ${product.name}. Available finishes: ${availableFinishes || "none"}. Please remove the old item and add it again.`,
        );
      }

      const availableStock = variant.stock - variant.reserved;

      if (item.quantity > availableStock) {
        throw new Error(`Only ${availableStock} units available for ${product.name}`);
      }

      const unitPrice = Number(product.price) + Number(variant.priceAdjustment);

      return {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productCode: product.productCode ?? product.sku,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

    let shippingAddress = input.addressId
      ? await transaction.address.findFirst({
          where: {
            id: input.addressId,
            userId: input.userId,
          },
        })
      : null;

    if (!shippingAddress && input.address) {
      await transaction.address.updateMany({
        where: { userId: input.userId },
        data: { isDefault: false },
      });

      shippingAddress = await transaction.address.create({
        data: {
          userId: input.userId,
          type: "HOME",
          fullName: input.address.fullName,
          phone: input.address.phone,
          line1: input.address.addressLine1,
          line2: input.address.addressLine2 || null,
          city: input.address.city,
          state: input.address.state,
          postalCode: input.address.pincode,
          isDefault: true,
        },
      });
    }

    if (!shippingAddress) {
      throw new Error("Choose or add a delivery address.");
    }

    const deliveryArea = await findServiceableArea({
      state: shippingAddress.state,
      city: shippingAddress.city,
      pincode: shippingAddress.postalCode,
    });

    if (!deliveryArea) {
      throw new Error(
        "Delivery is not available for this pincode. Please choose a supported state, city, and pincode.",
      );
    }

    const shippingFee = subtotal >= 50000 ? 0 : deliveryArea.deliveryCharge;
    const total = subtotal + shippingFee;
    const paymentPlan = input.paymentPlan === "partial" ? "PARTIAL" : "FULL";
    const breakdown = calculateOrderPaymentBreakdown(
      total,
      paymentPlan,
      input.paymentMethod === "razorpay" && input.isPaymentVerified
        ? paymentPlan === "PARTIAL"
          ? Math.ceil(total * 0.3)
          : total
        : 0,
    );
    const advanceAmount = breakdown.advanceAmount;
    const paidAmount = breakdown.paidAmount;
    const dueAmount = breakdown.dueAmount;
    const paymentStatus = breakdown.paymentStatus;

    await reserveOrderInventory(transaction, orderItems);

    const order = await transaction.order.create({
      data: {
        orderNumber: createOrderNumber(),
        userId: input.userId,
        shippingAddressId: shippingAddress.id,
        status:
          input.paymentMethod === "razorpay" && !input.isPaymentVerified
            ? "PENDING"
            : "CONFIRMED",
        paymentStatus,
        paymentPlan,
        subtotal,
        shippingFee,
        total,
        paidAmount,
        dueAmount,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            method: input.paymentMethod === "razorpay" ? "RAZORPAY" : "COD",
            status: paymentStatus,
            providerOrderId: input.providerOrderId,
            amount: advanceAmount,
            outstandingAmount: dueAmount,
          },
        },
        trackingEvents: {
          create: {
            status:
              input.paymentMethod === "razorpay" && !input.isPaymentVerified
                ? "PENDING"
                : "CONFIRMED",
            label:
              input.paymentMethod === "razorpay" && !input.isPaymentVerified
                ? "Payment pending"
                : trackingStatusLabels.CONFIRMED,
            notes:
              input.paymentMethod === "razorpay" && !input.isPaymentVerified
                ? "Complete payment to confirm this order."
                : "Your order has been received by the Shissoo team.",
          },
        },
      },
      include: {
        items: true,
        payment: true,
        trackingEvents: true,
      },
    });

    await transaction.adminNotification.create({
      data: {
        type: "ORDER",
        title: "New order received",
        message: `${order.orderNumber} from a customer needs review.`,
        href: `/admin/orders?highlight=${encodeURIComponent(order.orderNumber)}`,
        productName: orderItems[0]?.productName,
        productImageUrl: productBySlug.get(input.items[0]?.productSlug ?? "")?.images[0]?.url,
      },
    });

    return order;
  }, { maxWait: 10000, timeout: 60000 });
}

export async function verifyAccountRazorpayPayment(input: {
  userId: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findFirst({
      where: {
        userId: input.userId,
        orderNumber: input.orderNumber,
      },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      throw new Error("Order payment could not be found.");
    }

    if (order.payment.method !== "RAZORPAY") {
      throw new Error("This order is not a Razorpay payment.");
    }

    if (order.payment.providerOrderId !== input.razorpayOrderId) {
      throw new Error("Payment order mismatch.");
    }

    if (order.payment.providerPaymentId) {
      return order;
    }

    const breakdown = calculateOrderPaymentBreakdown(
      Number(order.total),
      order.paymentPlan,
      Number(order.payment.amount),
    );
    const paidAmount = breakdown.paidAmount;
    const dueAmount = breakdown.dueAmount;
    const paymentStatus = dueAmount > 0 ? "PARTIALLY_PAID" : "PAID";

    await transaction.payment.update({
      where: { orderId: order.id },
      data: {
        status: paymentStatus,
        providerPaymentId: input.razorpayPaymentId,
        providerSignature: input.razorpaySignature,
        outstandingAmount: dueAmount,
        paidAt: new Date(),
      },
    });

    return transaction.order.update({
      where: { id: order.id },
      data: {
        status: "CONFIRMED",
        paymentStatus,
        paidAmount,
        dueAmount,
        trackingEvents: {
          create: {
            status: "CONFIRMED",
            label: "Payment verified",
            notes:
              dueAmount > 0
                ? "Advance payment received through Razorpay."
                : "Full payment received through Razorpay.",
          },
        },
      },
    });
  }, { maxWait: 10000, timeout: 60000 });
}

export async function listAccountOrders(userId: string): Promise<AccountOrder[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
          variant: true,
        },
      },
      payment: true,
      returnRequest: true,
      trackingEvents: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    refundTransactionId: order.payment?.providerRefundId ?? null,
    paymentMethod: order.payment?.method ?? "COD",
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    paidAmount: Number(order.paidAmount),
    dueAmount: Number(order.dueAmount),
    paymentPlan: order.paymentPlan,
    createdAt: order.createdAt.toISOString(),
    trackingEvents: order.trackingEvents.map((event) => ({
      status: event.status,
      label: event.label,
      notes: event.notes ?? "",
      createdAt: event.createdAt.toISOString(),
    })),
    returnRequest: order.returnRequest
      ? {
          status: order.returnRequest.status,
          reason: order.returnRequest.reason,
          notes: order.returnRequest.notes ?? "",
        }
      : null,
    items: order.items.map((item) => ({
      productName: item.productName,
      productCode: item.productCode,
      imageUrl: item.product.images[0]?.url ?? null,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
      baseUnitPrice: Number(item.product.price),
      variantCharge: Number(item.variant?.priceAdjustment ?? 0),
      finish: item.variant?.finish,
      grade: item.variant?.grade,
    })),
  }));
}

export async function cancelAccountOrder(userId: string, orderNumber: string) {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findFirst({
      where: { userId, orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (["DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"].includes(order.status)) {
      throw new Error("This order can no longer be cancelled.");
    }

    await applyOrderInventoryTransition(
      transaction,
      order.items,
      order.status,
      "CANCELLED",
    );

    return transaction.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        trackingEvents: {
          create: {
            status: "CANCELLED",
            label: trackingStatusLabels.CANCELLED,
            notes: "The order was cancelled from the customer account.",
          },
        },
      },
    });
  }, { maxWait: 10000, timeout: 60000 });
}

export async function requestAccountReturn(input: {
  userId: string;
  orderNumber: string;
  reason: string;
  notes?: string;
}) {
  const reason = input.reason.trim();

  if (!reason) {
    throw new Error("Return reason is required.");
  }

  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findFirst({
      where: { userId: input.userId, orderNumber: input.orderNumber },
      include: { items: true, returnRequest: true },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.status !== "DELIVERED") {
      throw new Error("Only delivered orders can be returned.");
    }

    if (order.returnRequest) {
      throw new Error("A return request already exists for this order.");
    }

    await applyOrderInventoryTransition(
      transaction,
      order.items,
      order.status,
      "RETURN_REQUESTED",
    );

    const updatedOrder = await transaction.order.update({
      where: { id: order.id },
      data: {
        status: "RETURN_REQUESTED",
        trackingEvents: {
          create: {
            status: "RETURN_REQUESTED",
            label: trackingStatusLabels.RETURN_REQUESTED,
            notes: reason,
          },
        },
      },
    });

    await transaction.returnRequest.create({
      data: {
        orderId: order.id,
        status: "REQUESTED",
        reason,
        notes: input.notes?.trim() || null,
      },
    });

    return updatedOrder;
  }, { maxWait: 10000, timeout: 60000 });
}
