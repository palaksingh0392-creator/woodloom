"use client";

import Link from "next/link";

import { ChevronDown, Heart, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";

import BrandLogo from "@/components/brand/brand-logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import type { NavigationCategory, NavigationLink } from "@/lib/navigation";
import { useCartCount, useWishlistCount } from "@/store/commerce-store";

import Container from "../shared/container";

export default function Navbar({
  links,
  categories = [],
}: {
  links: NavigationLink[];
  categories?: NavigationCategory[];
}) {
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
            min-h-16
            xl:min-h-20
            py-1

            grid
            grid-cols-[minmax(0,1fr)_auto]
            xl:grid-cols-[minmax(260px,0.85fr)_minmax(320px,1fr)_auto]

            items-center
            gap-2
            sm:gap-4
            max-[420px]:gap-1.5
          "
        >
          {/* LEFT */}
          <div className="min-w-0 shrink">
            <Link
              href="/"
              aria-label="Shissoo home"
              className="group block w-fit max-w-full transition-transform duration-200 hover:scale-[1.02]"
            >
              <BrandLogo
                priority
                size="wide"
                className="w-[150px] max-w-full opacity-95 transition-opacity duration-200 group-hover:opacity-100 sm:w-[180px] xl:w-[220px]"
              />
            </Link>
          </div>

          {/* CENTER SEARCH */}
          <form
            action="/search"
            method="get"
            data-hover-label="Search"
            className="hidden h-11 w-full max-w-[560px] items-center justify-self-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 transition-colors duration-200 hover:border-[var(--primary)] focus-within:border-[var(--primary)] xl:flex"
          >
            <input
              name="q"
              aria-label="Search products"
              placeholder="Search products, materials, or categories"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)]"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="ml-3 text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              <Search size={21} />
            </button>
          </form>

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-2
              max-[380px]:gap-1.5
              sm:gap-5
            "
          >
            <Link
              href="/search"
              aria-label="Search"
              data-hover-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-[var(--surface-muted)] hover:text-[var(--primary)] xl:hidden"
            >
              <Search size={21} />
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              data-hover-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-[var(--surface-muted)] hover:text-[var(--primary)] sm:flex"
            >
              <User size={22} />
            </Link>


            <Link
              href="/wishlist"
              aria-label="Wishlist"
              data-hover-label="Wishlist"
              className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-[var(--surface-muted)] hover:text-[var(--primary)] sm:h-10 sm:w-10"
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
              data-hover-label="Cart"
              className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-[var(--surface-muted)] hover:text-[var(--primary)] sm:h-10 sm:w-10"
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
            <Link
              href="/admin-login"
              aria-label="Admin login"
              title="Admin login"
              data-hover-label="Admin login"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:scale-105 hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-9 sm:w-9"
            >
              <ShieldCheck size={18} />
            </Link>
            <span className="hidden xl:block"><ThemeToggle /></span>
          </div>
        </div>

        <nav className="hidden min-h-10 items-center justify-center gap-x-5 gap-y-1 border-t border-[var(--border)] py-0.5 text-sm font-medium text-[var(--text-secondary)] xl:flex xl:flex-wrap">
          {links.map((link) => (
            (() => {
              const category = categories.find(
                (item) => link.href === `/furniture/${item.slug}`,
              );

              return (
                <div key={link.id} className="group relative shrink-0">
                  <Link
                    href={link.href}
                    data-hover-label={link.label}
                    data-hover-label-placement="above"
                    className="relative inline-flex items-center gap-1 rounded-md px-2 py-2 text-center transition-colors duration-200 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                    {category?.subcategories.length ? <ChevronDown size={13} aria-hidden="true" /> : null}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--primary)] transition-transform duration-200 group-hover:scale-x-100"
                    />
                  </Link>
                  {category?.subcategories.length ? (
                    <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <Link href={link.href} className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]">
                        All {category.name}
                      </Link>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`${link.href}?subcategory=${subcategory.slug}`}
                          className="block rounded px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })()
          ))}
        </nav>

        <nav className="flex h-11 items-center gap-5 overflow-x-auto border-t text-sm font-medium text-[var(--text-secondary)] scrollbar-hide xl:hidden">
          {links.map((link) => (
            (() => {
              const category = categories.find(
                (item) => link.href === `/furniture/${item.slug}`,
              );

              if (!category?.subcategories.length) {
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    data-hover-label={link.label}
                    data-hover-label-placement="above"
                    className="group relative shrink-0 rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                    <span aria-hidden="true" className="absolute inset-x-2 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full bg-[var(--primary)] transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                );
              }

              return (
                <details key={link.id} className="relative shrink-0">
                  <summary
                    data-hover-label={link.label}
                    data-hover-label-placement="above"
                    className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1.5 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                    <ChevronDown size={13} aria-hidden="true" />
                  </summary>
                  <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
                    <Link href={link.href} className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]">All {category.name}</Link>
                    {category.subcategories.map((subcategory) => (
                      <Link key={subcategory.id} href={`${link.href}?subcategory=${subcategory.slug}`} className="block rounded px-3 py-2 text-sm hover:bg-[var(--surface-muted)]">
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })()
          ))}
        </nav>
      </Container>
    </header>
  );
}
