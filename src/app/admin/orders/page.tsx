import AdminOrdersTable from "@/features/admin/components/admin-orders-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { getAdminOrders } from "@/lib/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <AdminSectionCard title="Order Management">
      <AdminOrdersTable orders={orders} editable />
    </AdminSectionCard>
  );
}
