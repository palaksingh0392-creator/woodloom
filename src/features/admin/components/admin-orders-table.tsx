"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { AdminOrder } from "@/data/admin";
import { orderStatuses, paymentStatuses } from "@/lib/order-status";

import OrderStatusPill from "./order-status-pill";

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return requested",
  RETURNED: "Returned",
};

const controlClass =
  "h-9 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-semibold outline-none focus:border-[var(--primary)] disabled:opacity-60";

export default function AdminOrdersTable({
  orders,
  editable = false,
}: {
  orders: AdminOrder[];
  editable?: boolean;
}) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function updateOrder(
    order: AdminOrder,
    patch: { status?: string; paymentStatus?: string },
  ) {
    if (!order.databaseId) return;
    setUpdatingId(order.databaseId);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${order.databaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not update order.");
      }

      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update order.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="py-14 text-center text-sm text-[var(--text-secondary)]">
        No customer orders yet.
      </div>
    );
  }

  return (
    <div>
      {message ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {message}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-xs uppercase text-[var(--text-secondary)]">
            <tr className="border-b">
              <th className="py-3 pr-4 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Placed</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="py-3 pl-4 font-semibold text-right">Total</th>
              {editable ? <th className="w-12 py-3 pl-3" /> : null}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const isUpdating = updatingId === order.databaseId;

              return (
                <OrderRows
                  key={order.id}
                  order={order}
                  editable={editable}
                  isExpanded={isExpanded}
                  isUpdating={isUpdating}
                  onToggle={() => setExpandedId(isExpanded ? null : order.id)}
                  onUpdate={(patch) => updateOrder(order, patch)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRows({
  order,
  editable,
  isExpanded,
  isUpdating,
  onToggle,
  onUpdate,
}: {
  order: AdminOrder;
  editable: boolean;
  isExpanded: boolean;
  isUpdating: boolean;
  onToggle: () => void;
  onUpdate: (patch: { status?: string; paymentStatus?: string }) => void;
}) {
  return (
    <>
      <tr className="border-b">
        <td className="py-4 pr-4">
          <strong className="block">{order.id}</strong>
          <span className="text-xs text-[var(--text-secondary)]">{order.item}</span>
        </td>
        <td className="px-4 py-4">
          <span className="block font-medium">{order.customer}</span>
          {editable && order.email ? (
            <span className="text-xs text-[var(--text-secondary)]">{order.email}</span>
          ) : null}
        </td>
        <td className="px-4 py-4 text-[var(--text-secondary)]">{order.date}</td>
        <td className="px-4 py-4">
          {editable && order.databaseId ? (
            <select
              aria-label={`Payment status for ${order.id}`}
              value={order.paymentStatus ?? "PENDING"}
              disabled={isUpdating}
              onChange={(event) => onUpdate({ paymentStatus: event.target.value })}
              className={controlClass}
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status] ?? status}
                </option>
              ))}
            </select>
          ) : (
            order.payment
          )}
        </td>
        <td className="px-4 py-4">
          {editable && order.databaseId ? (
            <select
              aria-label={`Order status for ${order.id}`}
              value={order.statusCode ?? "PENDING"}
              disabled={isUpdating}
              onChange={(event) => onUpdate({ status: event.target.value })}
              className={controlClass}
            >
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status] ?? status}
                </option>
              ))}
            </select>
          ) : (
            <OrderStatusPill status={order.status} />
          )}
        </td>
        <td className="py-4 pl-4 text-right font-semibold">{order.total}</td>
        {editable ? (
          <td className="py-4 pl-3 text-right">
            <button
              type="button"
              title={isExpanded ? "Hide order details" : "View order details"}
              onClick={onToggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
            >
              {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>
          </td>
        ) : null}
      </tr>

      {editable && isExpanded ? (
        <tr className="border-b bg-[var(--surface-soft)]">
          <td colSpan={7} className="p-4">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-3">
                <Detail label="Customer" value={order.customer} />
                <Detail label="Email" value={order.email ?? "Not provided"} />
                <Detail label="Phone" value={order.phone ?? "Not provided"} />
                <Detail label="Payment method" value={order.paymentMethod ?? "Not recorded"} />
                <Detail label="Shipping address" value={order.address ?? "Not provided"} />
                {order.returnRequest ? (
                  <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
                    <Detail
                      label="Return request"
                      value={`${order.returnRequest.status}: ${order.returnRequest.reason}`}
                    />
                    {order.returnRequest.notes ? (
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        {order.returnRequest.notes}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-[var(--text-secondary)]">
                  Order items
                </p>
                <div className="divide-y rounded-md border bg-[var(--surface)]">
                  {order.items?.map((item) => (
                    <div
                      key={`${order.id}-${item.sku}`}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div>
                        <strong className="block">{item.productName}</strong>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {item.sku} · Qty {item.quantity}
                        </span>
                      </div>
                      <strong>{item.total}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
