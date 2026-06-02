import { Suspense } from "react";

import MainLayout from "@/components/layout/main-layout";
import SearchPageContent from "@/features/search/components/search-page-content";
import { listCatalogCategories, listCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Search | WOODLOOM",
  description:
    "Search premium wooden furniture, room categories, materials, and finishes from WOODLOOM.",
};

export default async function SearchPage() {
  const categories = listCatalogCategories();
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <Suspense fallback={null}>
        <SearchPageContent categories={categories} products={products} />
      </Suspense>
    </MainLayout>
  );
}
