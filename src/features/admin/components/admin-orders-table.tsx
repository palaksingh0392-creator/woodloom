import type { AdminOrder } from "@/data/admin";

import OrderStatusPill from "./order-status-pill";

export default function AdminOrdersTable({ orders }: { orders: AdminOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          <tr className="border-b">
            <th className="py-3 pr-4 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Item</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="py-3 pl-4 font-semibold text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{order.id}</td>
              <td className="px-4 py-4">{order.customer}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">
                {order.item}
              </td>
              <td className="px-4 py-4">{order.payment}</td>
              <td className="px-4 py-4">
                <OrderStatusPill status={order.status} />
              </td>
              <td className="py-4 pl-4 text-right font-semibold">
                {order.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
