"use client";

import Link from "next/link";

import { Heart, Search, ShoppingBag, User } from "lucide-react";

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
            grid-cols-[1fr_auto]
            lg:grid-cols-3

            items-center
            gap-4
          "
        >
          {/* LEFT */}
          <div>
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
                  tracking-[4px]
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
            <Link href="/furniture/living-room">Living Room</Link>

            <Link href="/furniture/bedroom">Bedroom</Link>

            <Link href="/furniture/dining-room">Dining</Link>

            <Link href="/furniture/office">Office</Link>

            <Link href="/furniture/decor">Decor</Link>

            <Link href="/furniture">Collections</Link>

            <Link href="/blog">Blog</Link>
          </nav>

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              sm:gap-5
            "
          >
            <Link href="/search" aria-label="Search" className="hidden sm:block">
              <Search size={22} />
            </Link>

            <Link href="/account" aria-label="Account" className="hidden sm:block">
              <User size={22} />
            </Link>

            <Link href="/wishlist" aria-label="Wishlist" className="relative">
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

            <Link href="/cart" aria-label="Cart" className="relative">
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
      </Container>
    </header>
  );
}
