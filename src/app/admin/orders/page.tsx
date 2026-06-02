import { adminOrders } from "@/data/admin";
import AdminOrdersTable from "@/features/admin/components/admin-orders-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";

export default function AdminOrdersPage() {
  return (
    <AdminSectionCard title="Order Management">
      <AdminOrdersTable orders={adminOrders} />
    </AdminSectionCard>
  );
}
