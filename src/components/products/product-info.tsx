"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  Heart,
  Minus,
  PackageCheck,
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
import { canReserveVariant } from "@/lib/stock";
import { parsePriceAmount } from "@/lib/price";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);
  const visibleGrades = product.grades?.filter(Boolean) ?? [];
  const [selectedGrade, setSelectedGrade] = useState("");
  const [openSection, setOpenSection] = useState("details");
  const isWishlisted = useIsWishlisted(product.slug);
  const selectedFinishStock = product.inventoryByFinish?.[selectedFinish] ?? null;
  const selectedVariantKey = `${selectedFinish.trim().toLowerCase()}::${selectedGrade.trim().toLowerCase()}`;
  const selectedGradeAdjustment =
    product.variantPriceAdjustments?.[selectedVariantKey] ??
    (selectedGrade ? product.gradePriceAdjustments?.[selectedGrade] ?? 0 : 0);
  const selectedPrice = parsePriceAmount(product.price) + selectedGradeAdjustment;
  const displayPrice = `Rs. ${selectedPrice.toLocaleString("en-IN")}`;
  const stockLimit = selectedFinishStock ?? Number.MAX_SAFE_INTEGER;
  const isSoldOut = selectedFinishStock !== null && selectedFinishStock <= 0;
  const stockLabel =
    selectedFinishStock === null
      ? "Ready to ship"
      : selectedFinishStock <= 0
        ? "Out of stock"
        : selectedFinishStock <= 5
          ? `Only ${selectedFinishStock} left`
          : `${selectedFinishStock} in stock`;

  const handleQuantityChange = (nextQuantity: number) => {
    if (selectedFinishStock !== null) {
      setQuantity(Math.min(Math.max(1, nextQuantity), selectedFinishStock));
      return;
    }

    setQuantity(Math.max(1, nextQuantity));
  };

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
          text-xs
          text-[var(--primary)]
          mb-4
        "
      >
        {product.collection}
      </p>

      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
          isSoldOut
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        <PackageCheck size={15} />
        {stockLabel}
      </span>

      <h1
        className="
          text-4xl
          sm:text-[2.75rem]
          lg:text-5xl
          leading-[1.08]
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
            text-2xl
            sm:text-3xl
            font-semibold
          "
        >
          {displayPrice}
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
          text-base
          leading-7
          text-[var(--text-secondary)]
          max-w-[620px]
          mb-10
        "
      >
        {product.description}
      </p>

      <div className="mb-10">
        <div className="mb-4">
          <p
            className="
              text-xs
              uppercase
              tracking-[2px]
            "
          >
            Finish
          </p>
        </div>

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

        {visibleGrades.length > 0 ? (
          <div className="mt-7">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {visibleGrades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-full border px-4 py-3 transition-all sm:px-5 ${
                    selectedGrade === grade
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        ) : null}
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
            onClick={() => handleQuantityChange(quantity - 1)}
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

          <input
            type="number"
            min={1}
            max={selectedFinishStock ?? undefined}
            value={quantity}
            onChange={(event) => handleQuantityChange(Number(event.target.value))}
            aria-label="Quantity"
            className="w-14 bg-transparent text-center outline-none"
          />

          <button
            onClick={() => {
              const nextQuantity = quantity + 1;
              if (!canReserveVariant(stockLimit, 0, nextQuantity)) {
                return;
              }
              handleQuantityChange(nextQuantity);
            }}
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
            if (!canReserveVariant(stockLimit, 0, quantity)) {
              return;
            }

            commerceActions.addToCart({
              productSlug: product.slug,
              title: product.title,
              price: product.price,
              image: product.images[0],
              finish: selectedFinish,
              grade: selectedGrade || undefined,
              quantity,
            });
            router.push("/cart");
          }}
          disabled={isSoldOut}
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
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSoldOut ? "Sold Out" : "Add To Cart"}
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
