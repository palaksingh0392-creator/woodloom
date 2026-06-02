"use client";

import Link from "next/link";

import { PackageCheck } from "lucide-react";

import type { AccountOrder } from "@/lib/orders";
import { formatPrice, useCommerceSelector } from "@/store/commerce-store";

export default function AccountOrdersContent({
  orders,
}: {
  orders: AccountOrder[];
}) {
  const lastOrder = useCommerceSelector((state) => state.lastOrder);

  if (orders.length > 0) {
    return (
      <div className="grid gap-5">
        {orders.map((order) => (
          <article
            key={order.orderNumber}
            className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7"
          >
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[3px] text-[var(--primary)]">
                  Order {order.orderNumber}
                </p>
                <h2 className="text-4xl leading-tight">{order.status}</h2>
              </div>

              <div className="rounded-full bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium">
                {order.paymentMethod}
              </div>
            </div>

            <div className="mb-5 grid gap-4 rounded-[20px] border border-[var(--border)] p-5 md:grid-cols-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Payment</p>
                <p className="font-medium">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Items</p>
                <p className="font-medium">{order.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Placed</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total</p>
                <p className="font-medium">{formatPrice(order.total)}</p>
              </div>
            </div>

            {order.items.map((item) => (
              <div
                key={`${order.orderNumber}-${item.sku}`}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] py-4 last:border-b-0"
              >
                <div>
                  <h3 className="text-xl">{item.productName}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.sku} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.total)}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
          <PackageCheck size={22} />
        </div>

        <h2 className="mb-4 text-4xl leading-tight">No Orders Yet</h2>
        <p className="mb-8 max-w-[560px] text-[var(--text-secondary)]">
          After checkout, order snapshots appear here. Database-backed order
          history and tracking statuses will connect in the backend phase.
        </p>

        <Link
          href="/furniture"
          className="inline-flex h-14 items-center rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
      <p className="mb-3 text-sm uppercase tracking-[3px] text-[var(--primary)]">
        Recent Order
      </p>
      <h2 className="mb-8 text-4xl leading-tight">Order {lastOrder.orderNumber}</h2>

      <div className="grid gap-5">
        <div className="grid gap-4 rounded-[20px] border border-[var(--border)] p-5 md:grid-cols-4">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Status</p>
            <p className="font-medium">Request captured</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Payment</p>
            <p className="font-medium">
              {lastOrder.paymentMethod === "cod" ? "Cash On Delivery" : "Razorpay"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Items</p>
            <p className="font-medium">{lastOrder.items.length}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total</p>
            <p className="font-medium">{formatPrice(lastOrder.total)}</p>
          </div>
        </div>

        {lastOrder.items.map((item) => (
          <div
            key={`${item.productSlug}-${item.finish}`}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] py-4 last:border-b-0"
          >
            <div>
              <h3 className="text-xl">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {item.finish} x {item.quantity}
              </p>
            </div>
            <p className="font-semibold">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
