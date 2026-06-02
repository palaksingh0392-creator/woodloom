import MainLayout from "@/components/layout/main-layout";
import AccountShell from "@/features/account/components/account-shell";
import AccountOrdersContent from "@/features/account/components/account-orders-content";
import { listAccountOrders } from "@/lib/orders";
import { requireCustomerSession } from "@/lib/session";

export const metadata = {
  title: "Orders | WOODLOOM",
  description: "View your WOODLOOM order history.",
};

export default async function AccountOrdersPage() {
  const session = await requireCustomerSession();
  const orders = await listAccountOrders(session.id);

  return (
    <MainLayout>
      <AccountShell>
        <AccountOrdersContent orders={orders} />
      </AccountShell>
    </MainLayout>
  );
}
