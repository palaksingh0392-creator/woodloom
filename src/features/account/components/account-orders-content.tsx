"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { PackageCheck } from "lucide-react";

import type { AccountOrder } from "@/lib/orders";
import { formatPrice, useCommerceSelector } from "@/store/commerce-store";

export default function AccountOrdersContent({
  orders,
}: {
  orders: AccountOrder[];
}) {
  const lastOrder = useCommerceSelector((state) => state.lastOrder);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [returningOrder, setReturningOrder] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");

  async function updateOrder(
    orderNumber: string,
    payload: { action: "cancel" | "return"; reason?: string },
  ) {
    setMessage("");
    setUpdatingOrder(orderNumber);

    const response = await fetch(`/api/orders/${orderNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { message?: string };

    setUpdatingOrder(null);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to update order.");
      return;
    }

    setReturningOrder(null);
    setReturnReason("");
    router.refresh();
  }

  if (orders.length > 0) {
    return (
      <div className="grid gap-5">
        {message ? (
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            {message}
          </p>
        ) : null}

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

            {order.returnRequest ? (
              <div className="mt-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm font-semibold">Return request: {order.returnRequest.status}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {order.returnRequest.reason}
                </p>
              </div>
            ) : null}

            <OrderActions
              order={order}
              isUpdating={updatingOrder === order.orderNumber}
              returningOrder={returningOrder}
              returnReason={returnReason}
              onReturnReasonChange={setReturnReason}
              onStartReturn={setReturningOrder}
              onCancel={() =>
                updateOrder(order.orderNumber, { action: "cancel" })
              }
              onReturn={() =>
                updateOrder(order.orderNumber, {
                  action: "return",
                  reason: returnReason,
                })
              }
            />
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

function OrderActions({
  order,
  isUpdating,
  returningOrder,
  returnReason,
  onReturnReasonChange,
  onStartReturn,
  onCancel,
  onReturn,
}: {
  order: AccountOrder;
  isUpdating: boolean;
  returningOrder: string | null;
  returnReason: string;
  onReturnReasonChange: (value: string) => void;
  onStartReturn: (orderNumber: string | null) => void;
  onCancel: () => void;
  onReturn: () => void;
}) {
  const canCancel = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"].includes(
    order.status,
  );
  const canReturn = order.status === "DELIVERED" && !order.returnRequest;
  const isReturning = returningOrder === order.orderNumber;

  if (!canCancel && !canReturn && !isReturning) return null;

  return (
    <div className="mt-6 border-t border-[var(--border)] pt-5">
      <div className="flex flex-wrap gap-3">
        {canCancel ? (
          <button
            type="button"
            disabled={isUpdating}
            onClick={onCancel}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--danger)] disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Cancel order"}
          </button>
        ) : null}
        {canReturn ? (
          <button
            type="button"
            onClick={() => onStartReturn(isReturning ? null : order.orderNumber)}
            className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold"
          >
            Request return
          </button>
        ) : null}
      </div>

      {isReturning ? (
        <div className="mt-4 grid gap-3">
          <textarea
            rows={3}
            value={returnReason}
            onChange={(event) => onReturnReasonChange(event.target.value)}
            placeholder="Tell us why you want to return this order"
            className="rounded-[18px] border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
          />
          <button
            type="button"
            disabled={isUpdating || !returnReason.trim()}
            onClick={onReturn}
            className="h-11 w-fit rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isUpdating ? "Submitting..." : "Submit return request"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
