import "server-only";

import type { CartItem, CheckoutAddress, PaymentMethod } from "@/store/commerce-store";
import { hasDatabaseUrl } from "@/lib/auth";
import {
  applyOrderInventoryTransition,
  reserveOrderInventory,
} from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export type AccountOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  returnRequest?: {
    status: string;
    reason: string;
    notes: string;
  } | null;
  items: {
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
};

export type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  address?: CheckoutAddress;
  addressId?: string;
  paymentMethod: PaymentMethod;
};

function createOrderNumber() {
  return `WL-${Date.now().toString().slice(-8)}`;
}

export async function createAccountOrder(input: CreateOrderInput) {
  if (!hasDatabaseUrl()) {
    return null;
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

      const variant = product.variants.find(
        (currentVariant) => currentVariant.finish === item.finish,
      );

      if (!variant) {
        throw new Error(`Finish not found for ${product.name}`);
      }

      const availableStock = variant.stock - variant.reserved;

      if (item.quantity > availableStock) {
        throw new Error(`Only ${availableStock} units available for ${product.name}`);
      }

      const unitPrice = Number(product.price);

      return {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const shippingFee = subtotal >= 50000 ? 0 : 999;
    const total = subtotal + shippingFee;

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

    await reserveOrderInventory(transaction, orderItems);

    return transaction.order.create({
      data: {
        orderNumber: createOrderNumber(),
        userId: input.userId,
        shippingAddressId: shippingAddress.id,
        status: "CONFIRMED",
        paymentStatus: input.paymentMethod === "cod" ? "PENDING" : "AUTHORIZED",
        subtotal,
        shippingFee,
        total,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            method: input.paymentMethod === "cod" ? "COD" : "RAZORPAY",
            status: input.paymentMethod === "cod" ? "PENDING" : "AUTHORIZED",
            amount: total,
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });
  });
}

export async function listAccountOrders(userId: string): Promise<AccountOrder[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      payment: true,
      returnRequest: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.payment?.method ?? "COD",
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    returnRequest: order.returnRequest
      ? {
          status: order.returnRequest.status,
          reason: order.returnRequest.reason,
          notes: order.returnRequest.notes ?? "",
        }
      : null,
    items: order.items.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
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
      data: { status: "CANCELLED" },
    });
  });
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
      data: { status: "RETURN_REQUESTED" },
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
  });
}
