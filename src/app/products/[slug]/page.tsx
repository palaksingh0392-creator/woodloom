import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import ReviewsSection from "@/components/products/reviews-section";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { listProductReviews } from "@/lib/reviews";
import { getCurrentSession } from "@/lib/session";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Shissoo",
    };
  }

  return {
    title: `${product.title} | Shissoo`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, reviews, session] = await Promise.all([
    getCatalogProductBySlug(slug),
    listProductReviews(slug),
    getCurrentSession(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <section
        className="
          bg-[var(--background)]
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
            min-w-0
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

        <ReviewsSection
          productSlug={product.slug}
          initialReviews={reviews}
          isLoggedIn={Boolean(session)}
        />
      </section>
    </MainLayout>
  );
}
