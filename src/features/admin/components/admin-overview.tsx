import Link from "next/link";

import {
  getAdminCustomers,
  getAdminInventory,
  getAdminMetrics,
  getAdminOrders,
} from "@/lib/admin";
import { listCatalogProducts } from "@/lib/catalog";

import AdminCustomersTable from "./admin-customers-table";
import AdminInventoryTable from "./admin-inventory-table";
import AdminOrdersTable from "./admin-orders-table";
import AdminSectionCard from "./admin-section-card";
import AdminStatCard from "./admin-stat-card";

export default async function AdminOverview() {
  const [products, adminMetrics, adminOrders, inventoryItems, customers] =
    await Promise.all([
      listCatalogProducts(),
      getAdminMetrics(),
      getAdminOrders(),
      getAdminInventory(),
      getAdminCustomers(),
    ]);
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock - item.reserved <= item.reorderAt,
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
                Customers
              </p>
              <strong className="mt-2 block text-3xl">
                {customers.length}
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

        <AdminSectionCard title="Recent Customers">
          <AdminCustomersTable customers={customers.slice(0, 5)} />
        </AdminSectionCard>
      </div>
    </div>
  );
}
