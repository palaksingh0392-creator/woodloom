import AdminOrdersTable from "@/features/admin/components/admin-orders-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { getAdminOrders } from "@/lib/admin";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string }>;
}) {
  const orders = await getAdminOrders();
  const params = await searchParams;

  return (
    <AdminSectionCard title="Order Management">
      <AdminOrdersTable orders={orders} editable highlightOrder={params.highlight} />
    </AdminSectionCard>
  );
}
