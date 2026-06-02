import MainLayout from "@/components/layout/main-layout";
import AccountShell from "@/features/account/components/account-shell";
import AddressManager from "@/features/account/components/address-manager";
import { listAccountAddresses } from "@/lib/account";
import { requireCustomerSession } from "@/lib/session";

export const metadata = {
  title: "Addresses | WOODLOOM",
  description: "Manage your WOODLOOM delivery addresses.",
};

export default async function AccountAddressesPage() {
  const session = await requireCustomerSession();
  const addresses = await listAccountAddresses(session.id);

  return (
    <MainLayout>
      <AccountShell>
        <AddressManager initialAddresses={addresses} />
      </AccountShell>
    </MainLayout>
  );
}
