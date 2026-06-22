import "server-only";

import {
  adminMetrics,
  adminOrders,
  customerMessages,
  inventoryItems,
  type AdminOrder,
  type InventoryItem,
} from "@/data/admin";
import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminMetric = {
  label: string;
  value: string;
  change: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  joined: string;
  status: string;
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function mapOrderStatus(status: string): AdminOrder["status"] {
  if (status === "PENDING") return "Pending";
  if (status === "CONFIRMED") return "Confirmed";
  if (status === "PROCESSING") return "Processing";
  if (status === "PACKED") return "Packed";
  if (status === "SHIPPED") return "Shipped";
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELLED") return "Cancelled";
  if (status === "RETURN_REQUESTED") return "Return requested";
  if (status === "RETURNED") return "Returned";
  return "Pending";
}

function mapPayment(method: string | undefined, status: string): AdminOrder["payment"] {
  if (method === "COD") return "COD";
  if (status === "PAID") return "Paid";
  return "Pending";
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!hasDatabaseUrl()) return adminOrders;

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: true,
        payment: true,
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return orders.map((order) => ({
      id: order.orderNumber,
      databaseId: order.id,
      customer: order.user.name,
      email: order.user.email,
      phone: order.user.phone ?? order.shippingAddress?.phone ?? "Not provided",
      item:
        order.items.length > 1
          ? `${order.items[0]?.productName ?? "Furniture"} +${order.items.length - 1}`
          : order.items[0]?.productName ?? "Furniture order",
      items: order.items.map((item) => ({
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        total: formatPrice(Number(item.total)),
      })),
      address: order.shippingAddress
        ? [
            order.shippingAddress.line1,
            order.shippingAddress.line2,
            order.shippingAddress.city,
            order.shippingAddress.state,
            order.shippingAddress.postalCode,
          ]
            .filter(Boolean)
            .join(", ")
        : "No shipping address",
      total: formatPrice(Number(order.total)),
      payment: mapPayment(order.payment?.method, order.paymentStatus),
      paymentMethod: order.payment?.method ?? "Not recorded",
      paymentStatus: order.paymentStatus,
      status: mapOrderStatus(order.status),
      statusCode: order.status,
      date: order.createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));
  } catch {
    return adminOrders;
  }
}

export async function getAdminInventory(): Promise<InventoryItem[]> {
  if (!hasDatabaseUrl()) return inventoryItems;

  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { stock: "asc" },
    });

    return variants.map((variant) => ({
      sku: variant.sku,
      product: `${variant.product.name} - ${variant.finish}`,
      category: variant.product.category.name,
      stock: variant.stock,
      reserved: variant.reserved,
      reorderAt: variant.reorderAt,
    }));
  } catch {
    return inventoryItems;
  }
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  if (!hasDatabaseUrl()) {
    return customerMessages.map((message, index) => ({
      id: `demo-${index}`,
      name: message.name,
      email: "Demo customer",
      phone: "Not connected",
      orders: 0,
      joined: message.received,
      status: message.priority,
    }));
  }

  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "Not provided",
      orders: customer._count.orders,
      joined: customer.createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: customer.status,
    }));
  } catch {
    return [];
  }
}

export async function getAdminMetrics(): Promise<AdminMetric[]> {
  if (!hasDatabaseUrl()) return adminMetrics;

  try {
    const [revenue, openOrders, variants, customers] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { notIn: ["CANCELLED", "RETURNED"] } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { status: { notIn: ["DELIVERED", "CANCELLED", "RETURNED"] } },
      }),
      prisma.productVariant.findMany({
        select: {
          stock: true,
          reserved: true,
          reorderAt: true,
        },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);
    const lowStock = variants.filter(
      (variant) => variant.stock - variant.reserved <= variant.reorderAt,
    ).length;

    return [
      {
        label: "Revenue",
        value: formatPrice(Number(revenue._sum.total ?? 0)),
        change: "Live orders",
      },
      { label: "Open orders", value: String(openOrders), change: "Needs action" },
      { label: "Low stock", value: String(lowStock), change: "Needs review" },
      { label: "Customers", value: String(customers), change: "Registered" },
    ];
  } catch {
    return adminMetrics;
  }
}
