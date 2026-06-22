import AdminCustomersTable from "@/features/admin/components/admin-customers-table";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { getAdminCustomers } from "@/lib/admin";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <AdminSectionCard title="Customer Management">
      <AdminCustomersTable customers={customers} />
    </AdminSectionCard>
  );
}
