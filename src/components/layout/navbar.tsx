"use client";

import Link from "next/link";

import { Heart, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";

import ThemeToggle from "@/components/ui/theme-toggle";
import { useCartCount, useWishlistCount } from "@/store/commerce-store";

import Container from "../shared/container";

export default function Navbar() {
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  return (
    <header
      className="
        sticky
        top-0
        z-50

        bg-[var(--background)]/92
        backdrop-blur-xl

        border-b
      "
    >
      <Container>
        <div
          className="
            h-20
            lg:h-24

            grid
            grid-cols-[minmax(0,1fr)_auto]
            lg:grid-cols-3

            items-center
            gap-3
            sm:gap-4
          "
        >
          {/* LEFT */}
          <div className="min-w-0">
            <Link
              href="/"
              className="
                flex
                flex-col
                leading-none
              "
            >
              <span
                className="
                  text-[1.5rem]
                  max-[380px]:text-[1.25rem]
                  sm:text-[2rem]
                  font-bold
                  tracking-tight
                "
              >
                WOODLOOM
              </span>

              <span
                className="
                  text-[10px]
                  max-[380px]:hidden
                  tracking-[0.28em]
                  uppercase

                  text-muted

                  mt-2
                "
              >
                Live Beautifully
              </span>
            </Link>
          </div>

          {/* CENTER */}
          <nav
            className="
              hidden
              lg:flex

              items-center
              justify-center
              gap-10
            "
          >
            <Link href="/furniture/living-room">LivingRoom</Link>

            <Link href="/furniture/bedroom">Bedroom</Link>

            <Link href="/furniture/dining-room">Dining</Link>

            <Link href="/furniture/office">Office</Link>

            <Link href="/furniture/decor">Decor</Link>

            <Link href="/furniture">Collections</Link>

           <Link
                href="/blog"
              >
               Blog
              </Link>
          </nav>

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              max-[380px]:gap-2
              sm:gap-5
            "
          >
            <Link
              href="/search"
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-muted)] sm:flex"
            >
              <Search size={22} />
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-muted)] sm:flex"
            >
              <User size={22} />
            </Link>

            <Link
              href="/admin-login"
              aria-label="Admin login"
              title="Admin login"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-muted)] sm:h-10 sm:w-10"
            >
              <ShieldCheck size={22} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-muted)] sm:h-10 sm:w-10"
            >
              <Heart size={22} />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2

                    w-5
                    h-5

                    rounded-full

                    bg-[var(--primary)]
                    text-white

                    text-[10px]

                    flex
                    items-center
                    justify-center
                  "
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-muted)] sm:h-10 sm:w-10"
            >
              <ShoppingBag size={22} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2

                    w-5
                    h-5

                    rounded-full

                    bg-[var(--primary)]
                    text-white

                    text-[10px]

                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <ThemeToggle />
          </div>
        </div>

        <nav className="flex h-11 items-center gap-5 overflow-x-auto border-t text-sm font-medium text-[var(--text-secondary)] scrollbar-hide lg:hidden">
          <Link href="/products" className="shrink-0 hover:text-[var(--text-primary)]">
            Products
          </Link>
          <Link href="/furniture" className="shrink-0 hover:text-[var(--text-primary)]">
            Collections
          </Link>
          <Link href="/blog" className="shrink-0 hover:text-[var(--text-primary)]">
            Blog
          </Link>
          <Link href="/search" className="shrink-0 hover:text-[var(--text-primary)]">
            Search
          </Link>
        </nav>
      </Container>
    </header>
  );
}
