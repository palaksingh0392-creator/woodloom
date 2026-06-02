import { inventoryItems } from "@/data/admin";
import AdminInventoryTable from "@/features/admin/components/admin-inventory-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";

export default function AdminInventoryPage() {
  return (
    <AdminSectionCard title="Inventory Reports">
      <AdminInventoryTable items={inventoryItems} />
    </AdminSectionCard>
  );
}
