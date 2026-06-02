import { notFound } from "next/navigation";

import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import ReviewsSection from "@/components/products/reviews-section";
import {
  getCatalogProductBySlug,
  listCatalogProducts,
} from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await listCatalogProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | WOODLOOM",
    };
  }

  return {
    title: `${product.title} | WOODLOOM`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main
      className="
        bg-[var(--background)]
        min-h-screen
        pt-6
        lg:pt-10
        pb-20
        lg:pb-24
      "
    >
      <div
        className="
          max-w-[1440px]
          mx-auto
          px-5
          sm:px-6
          lg:px-10
          grid
          lg:grid-cols-2
          gap-10
          lg:gap-14
        "
      >
        <ProductGallery
          images={product.images}
          title={product.title}
          badge={product.badge}
        />

        <ProductInfo product={product} />
      </div>

      <ReviewsSection />
    </main>
  );
}
