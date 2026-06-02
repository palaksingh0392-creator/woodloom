import Link from "next/link";

import {
  adminMetrics,
  adminOrders,
  customerMessages,
  inventoryItems,
} from "@/data/admin";
import { listCatalogProducts } from "@/lib/catalog";

import AdminInventoryTable from "./admin-inventory-table";
import AdminOrdersTable from "./admin-orders-table";
import AdminSectionCard from "./admin-section-card";
import AdminStatCard from "./admin-stat-card";

export default async function AdminOverview() {
  const products = await listCatalogProducts();
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock <= item.reorderAt,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <AdminStatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <AdminSectionCard
          title="Recent Orders"
          action={
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-[var(--primary)]"
            >
              View all
            </Link>
          }
        >
          <AdminOrdersTable orders={adminOrders} />
        </AdminSectionCard>

        <AdminSectionCard title="Action Queue">
          <div className="space-y-4">
            <div className="rounded-lg bg-[var(--surface-muted)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Products live
              </p>
              <strong className="mt-2 block text-3xl">{products.length}</strong>
            </div>

            <div className="rounded-lg bg-[var(--surface-muted)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Low stock alerts
              </p>
              <strong className="mt-2 block text-3xl">
                {lowStockItems.length}
              </strong>
            </div>

            <div className="rounded-lg bg-[var(--surface-muted)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Customer messages
              </p>
              <strong className="mt-2 block text-3xl">
                {customerMessages.length}
              </strong>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <AdminSectionCard
          title="Inventory Watch"
          action={
            <Link
              href="/admin/inventory"
              className="text-sm font-semibold text-[var(--primary)]"
            >
              Manage
            </Link>
          }
        >
          <AdminInventoryTable items={inventoryItems} />
        </AdminSectionCard>

        <AdminSectionCard title="Customer Messages">
          <div className="space-y-3">
            {customerMessages.map((message) => (
              <article
                key={`${message.name}-${message.topic}`}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{message.name}</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {message.topic}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold">
                    {message.priority}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  {message.received}
                </p>
              </article>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
