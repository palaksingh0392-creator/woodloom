"use client";

import Image from "next/image";
import Link from "next/link";

import { Minus, Plus, Trash2 } from "lucide-react";

import {
  calculateCartTotals,
  commerceActions,
  formatPrice,
  useCommerceSelector,
} from "@/store/commerce-store";

export default function CartPageContent() {
  const cartItems = useCommerceSelector((state) => state.cartItems);
  const totals = calculateCartTotals(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-24">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Your Cart
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif mb-8">
          Your Cart Is Empty
        </h1>

        <Link
          href="/products"
          className="
            inline-flex
            h-14
            items-center
            rounded-full
            bg-[var(--primary)]
            px-8
            text-sm
            uppercase
            tracking-[2px]
            text-white
          "
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">
      <div className="mb-12">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Your Cart
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif">
          Review Your Pieces
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <article
              key={`${item.productSlug}-${item.finish}`}
              className="
                grid
                sm:grid-cols-[150px_1fr]
                gap-6
                rounded-[28px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-5
              "
            >
              <Link
                href={`/products/${item.productSlug}`}
                className="relative aspect-square overflow-hidden rounded-[22px] bg-[var(--surface-muted)]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[2px] text-[var(--text-secondary)] mb-2">
                    {item.finish}
                  </p>

              <Link href={`/products/${item.productSlug}`}>
                    <h2 className="mb-3 font-serif text-2xl sm:text-3xl">{item.title}</h2>
                  </Link>

                  <p className="text-xl font-semibold">{item.price}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border border-[var(--border)]">
                    <button
                      onClick={() =>
                        commerceActions.updateCartItemQuantity(
                          item.productSlug,
                          item.finish,
                          item.quantity - 1,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center">{item.quantity}</span>

                    <button
                      onClick={() =>
                        commerceActions.updateCartItemQuantity(
                          item.productSlug,
                          item.finish,
                          item.quantity + 1,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      commerceActions.removeCartItem(
                        item.productSlug,
                        item.finish,
                      )
                    }
                    className="flex items-center gap-2 text-sm uppercase tracking-[2px] text-[var(--text-secondary)] hover:text-[var(--danger)]"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside
          className="
            lg:sticky
            top-32
            rounded-[22px]
            sm:rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-5
            sm:p-8
          "
        >
          <h2 className="text-3xl font-serif mb-8">Order Summary</h2>

          <div className="grid gap-5 border-b border-[var(--border)] pb-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Delivery</span>
              <strong>
                {totals.deliveryCharge === 0
                  ? "Free"
                  : formatPrice(totals.deliveryCharge)}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-xl mb-8">
            <span>Total</span>
            <strong>{formatPrice(totals.total)}</strong>
          </div>

          <Link
            href="/checkout"
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-full
              bg-[var(--primary)]
              text-sm
              uppercase
              tracking-[2px]
              text-white
            "
          >
            Proceed To Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
