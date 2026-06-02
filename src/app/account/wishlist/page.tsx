import MainLayout from "@/components/layout/main-layout";
import AccountShell from "@/features/account/components/account-shell";
import AccountWishlistContent from "@/features/account/components/account-wishlist-content";
import { listCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Account Wishlist | WOODLOOM",
  description: "Manage your saved WOODLOOM furniture pieces.",
};

export default async function AccountWishlistPage() {
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <AccountShell>
        <AccountWishlistContent products={products} />
      </AccountShell>
    </MainLayout>
  );
}
