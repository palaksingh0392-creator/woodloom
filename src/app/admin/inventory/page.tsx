import AdminInventoryTable from "@/features/admin/components/admin-inventory-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { getAdminInventory } from "@/lib/admin";

export default async function AdminInventoryPage() {
  const items = await getAdminInventory();

  return (
    <AdminSectionCard title="Inventory Reports">
      <AdminInventoryTable items={items} />
    </AdminSectionCard>
  );
}
