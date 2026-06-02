import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import { listCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Products | WOODLOOM",
  description: "Explore premium wooden furniture from WOODLOOM.",
};

export default async function ProductsPage() {
  const products = await listCatalogProducts();

  return (
    <MainLayout>
      <section
        className="
          max-w-[1440px]
          mx-auto
          px-5
          sm:px-6
          lg:px-10
          py-14
          lg:py-20
        "
      >
        <div className="mb-12">
          <p
            className="
              uppercase
              tracking-[4px]
              text-[13px]
              text-[var(--primary)]
              mb-4
            "
          >
            WOODLOOM Collection
          </p>

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-7xl
              leading-[0.95]
              font-serif
              max-w-[760px]
            "
          >
            Premium Wooden Furniture For Modern Homes
          </h1>
        </div>

        <div
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div
                className="
                  relative
                  aspect-[4/5]
                  rounded-[24px]
                  overflow-hidden
                  bg-[var(--surface-muted)]
                  mb-5
                "
              >
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <p
                className="
                  uppercase
                  tracking-[2px]
                  text-xs
                  text-[var(--text-secondary)]
                  mb-2
                "
              >
                {product.category}
              </p>

              <h2 className="text-2xl font-serif mb-2">{product.title}</h2>
              <p className="text-[var(--text-secondary)] mb-3">
                {product.material}
              </p>
              <p className="text-xl font-semibold">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
