"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type { Product } from "@/data/products";
import {
  commerceActions,
  useIsWishlisted,
} from "@/store/commerce-store";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);
  const [openSection, setOpenSection] = useState("details");
  const isWishlisted = useIsWishlisted(product.slug);

  const sections = [
    {
      id: "details",
      title: "Product Details",
      content: `${product.material}. Dimensions: ${product.dimensions}.`,
    },
    {
      id: "materials",
      title: "Materials & Care",
      content: product.careInstructions,
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: `${product.warranty}. Ships within 5-7 business days with insured delivery service.`,
    },
  ];

  return (
    <div className="min-w-0 pt-4">
      <p
        className="
          uppercase
          tracking-[3px]
          text-sm
          text-[var(--primary)]
          mb-4
        "
      >
        {product.collection}
      </p>

      <h1
        className="
          text-4xl
          sm:text-5xl
          lg:text-6xl
          leading-[1.05]
          font-serif
          max-w-[620px]
          mb-6
        "
      >
        {product.title}
      </h1>

      <div
        className="
          flex
          items-center
          gap-4
          mb-8
        "
      >
        <p
          className="
            text-3xl
            font-semibold
          "
        >
          {product.price}
        </p>

        {product.compareAtPrice && (
          <span
            className="
              text-lg
              text-[var(--text-secondary)]
              line-through
            "
          >
            {product.compareAtPrice}
          </span>
        )}
      </div>

      <p
        className="
          text-[17px]
          leading-relaxed
          text-[var(--text-secondary)]
          max-w-[620px]
          mb-10
        "
      >
        {product.description}
      </p>

      <div className="mb-10">
        <p
          className="
            text-sm
            uppercase
            tracking-[2px]
            mb-4
          "
        >
          Finish
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          {product.finishes.map((finish) => (
            <button
              key={finish}
              onClick={() => setSelectedFinish(finish)}
              className={`
                px-4
                sm:px-5
                py-3
                rounded-full
                border
                transition-all

                ${
                  selectedFinish === finish
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }
              `}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>

      <div
        className="
          flex
          flex-col
          sm:flex-row
          flex-wrap
          items-stretch
          sm:items-center
          gap-5
          mb-12
        "
      >
        <div
          className="
            flex
            items-center
            border
            border-[var(--border)]
            rounded-full
            overflow-hidden
          "
        >
          <button
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            className="
              w-12
              h-12
              flex
              items-center
              justify-center
            "
          >
            <Minus size={18} />
          </button>

          <span
            className="
              w-12
              text-center
            "
          >
            {quantity}
          </span>

          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="
              w-12
              h-12
              flex
              items-center
              justify-center
            "
          >
            <Plus size={18} />
          </button>
        </div>

        <button
          onClick={() => {
            commerceActions.addToCart({
              productSlug: product.slug,
              title: product.title,
              price: product.price,
              image: product.images[0],
              finish: selectedFinish,
              quantity,
            });
            router.push("/cart");
          }}
          className="
            h-14
            px-8
            sm:px-10
            rounded-full
            bg-[var(--primary)]
            text-white
            uppercase
            tracking-[2px]
            text-sm
            hover:opacity-90
            transition-all
            flex-1
            sm:flex-none
          "
        >
          Add To Cart
        </button>

        <button
          onClick={() => commerceActions.toggleWishlist(product.slug)}
          className="
            w-14
            h-14
            rounded-full
            border
            border-[var(--border)]
            flex
            self-start
            sm:self-auto
            items-center
            justify-center
            hover:border-[var(--primary)]
            transition-all
          "
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            size={20}
            className={isWishlisted ? "fill-current" : ""}
          />
        </button>
      </div>

      <div
        className="
          grid
          gap-5
          mb-14
        "
      >
        <div className="flex items-center gap-4">
          <Truck size={20} />
          <p className="text-[15px]">Free delivery across selected cities</p>
        </div>

        <div className="flex items-center gap-4">
          <RotateCcw size={20} />
          <p className="text-[15px]">7-day easy returns</p>
        </div>

        <div className="flex items-center gap-4">
          <ShieldCheck size={20} />
          <p className="text-[15px]">{product.warranty}</p>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        {sections.map((section) => (
          <div
            key={section.id}
            className="
              border-b
              border-[var(--border)]
            "
          >
            <button
              onClick={() =>
                setOpenSection(openSection === section.id ? "" : section.id)
              }
              className="
                w-full
                max-w-full
                flex
                items-center
                justify-between
                py-6
                text-left
              "
            >
              <span
                className="
                  text-lg
                  font-medium
                "
              >
                {section.title}
              </span>

              <ChevronDown
                size={20}
                className={`
                  transition-transform
                  ${openSection === section.id ? "rotate-180" : ""}
                `}
              />
            </button>

            {openSection === section.id && (
              <p
                className="
                  pb-6
                  text-[var(--text-secondary)]
                  leading-relaxed
                "
              >
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
