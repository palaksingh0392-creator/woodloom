import "server-only";

import type { CartItem, CheckoutAddress, PaymentMethod } from "@/store/commerce-store";
import { hasDatabaseUrl } from "@/lib/auth";
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
  address: CheckoutAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  total: number;
};

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

function createOrderNumber() {
  return `WL-${Date.now().toString().slice(-8)}`;
}

export async function createAccountOrder(input: CreateOrderInput) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: input.items.map((item) => item.productSlug),
      },
    },
    include: {
      variants: true,
    },
  });

  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  const shippingAddress = await prisma.address.create({
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
    },
  });

  return prisma.order.create({
    data: {
      orderNumber: createOrderNumber(),
      userId: input.userId,
      shippingAddressId: shippingAddress.id,
      status: "CONFIRMED",
      paymentStatus: input.paymentMethod === "cod" ? "PENDING" : "AUTHORIZED",
      subtotal: input.subtotal,
      shippingFee: input.deliveryCharge,
      total: input.total,
      items: {
        create: input.items.map((item) => {
          const product = productBySlug.get(item.productSlug);
          const variant = product?.variants.find(
            (currentVariant) => currentVariant.finish === item.finish,
          );
          const unitPrice = parsePrice(item.price);

          if (!product) {
            throw new Error(`Product not found: ${item.productSlug}`);
          }

          return {
            productId: product.id,
            variantId: variant?.id,
            productName: item.title,
            sku: variant?.sku ?? product.sku,
            quantity: item.quantity,
            unitPrice,
            total: unitPrice * item.quantity,
          };
        }),
      },
      payment: {
        create: {
          method: input.paymentMethod === "cod" ? "COD" : "RAZORPAY",
          status: input.paymentMethod === "cod" ? "PENDING" : "AUTHORIZED",
          amount: input.total,
        },
      },
    },
    include: {
      items: true,
      payment: true,
    },
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
    items: order.items.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
  }));
}
