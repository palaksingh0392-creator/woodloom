import MainLayout from "@/components/layout/main-layout";
import WishlistPageContent from "@/features/wishlist/components/wishlist-page-content";
import { listCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Wishlist | Shissoo",
  description: "Your saved Shissoo furniture pieces.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <WishlistPageContent products={products} />
    </MainLayout>
  );
}
