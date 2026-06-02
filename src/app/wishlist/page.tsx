import MainLayout from "@/components/layout/main-layout";
import WishlistPageContent from "@/features/wishlist/components/wishlist-page-content";
import { listCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Wishlist | WOODLOOM",
  description: "Your saved WOODLOOM furniture pieces.",
};

export default async function WishlistPage() {
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <WishlistPageContent products={products} />
    </MainLayout>
  );
}
