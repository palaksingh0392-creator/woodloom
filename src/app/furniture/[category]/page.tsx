import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import { getCategoryBySlug } from "@/data/categories";
import FurnitureProductGrid from "@/features/furniture/components/furniture-product-grid";
import {
  listCatalogCategories,
  listCatalogProductsByCategorySlug,
} from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  const categories = listCatalogCategories();

  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | WOODLOOM",
    };
  }

  return {
    title: `${category.title} | WOODLOOM`,
    description: category.seoDescription,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await listCatalogProductsByCategorySlug(slug);

  return (
    <MainLayout>
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div
          className="
            mb-10
            grid
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Link href="/" className="hover:text-[var(--primary)]">
                Home
              </Link>
              <span>/</span>
              <Link href="/furniture" className="hover:text-[var(--primary)]">
                Furniture
              </Link>
              <span>/</span>
              <span className="text-[var(--text-primary)]">
                {category.shortTitle}
              </span>
            </div>

            <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              {category.shortTitle}
            </p>

            <h1 className="mb-6 text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
              {category.title}
            </h1>

            <p className="max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
              {category.description}
            </p>
          </div>

          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <Image
              src={category.image}
              alt={category.title}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        <FurnitureProductGrid
          products={categoryProducts}
          filters={category.filters}
        />
      </section>
    </MainLayout>
  );
}
