import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import FurnitureProductGrid from "@/features/furniture/components/furniture-product-grid";
import {
  getCatalogCategoryProductCount,
  listCatalogCategories,
  listCatalogProducts,
} from "@/lib/catalog";

export const metadata = {
  title: "Furniture | WOODLOOM",
  description:
    "Explore premium wooden furniture by room, material, and finish from WOODLOOM.",
};

export default async function FurniturePage() {
  const categories = listCatalogCategories();
  const products = await listCatalogProducts();
  const categoryCounts = new Map(
    await Promise.all(
      categories.map(async (category) => [
        category.slug,
        await getCatalogCategoryProductCount(category.slug),
      ] as const),
    ),
  );
  const allFilters = Array.from(
    new Set(categories.flatMap((category) => category.filters)),
  ).slice(0, 10);

  return (
    <MainLayout>
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              Furniture Collection
            </p>

            <h1 className="mb-6 max-w-[760px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
              Premium Wooden Furniture By Room
            </h1>

            <p className="max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
              Browse curated living, dining, workspace, bedroom, and decor
              pieces with warm Scandinavian styling and practical everyday
              durability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/furniture/${category.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                "
              >
                <div className="relative aspect-[4/3] bg-[var(--surface-muted)]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 1024px) 15vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h2 className="mb-1 text-xl leading-tight">
                    {category.shortTitle}
                  </h2>
                  <p className="text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
                    {categoryCounts.get(category.slug) ?? 0} Products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <FurnitureProductGrid products={products} filters={allFilters} />
      </section>
    </MainLayout>
  );
}
