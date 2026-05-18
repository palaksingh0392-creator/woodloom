import Link from "next/link";

import { Heart, ShoppingBag, Search } from "lucide-react";

import ThemeToggle from "@/components/ui/theme-toggle";

import Container from "../shared/container";

export default function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-50

        backdrop-blur-xl
        border-b

        bg-[var(--background)]/80
      "
    >
      <Container>
        <div
          className="
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="
                text-2xl
                font-bold
                tracking-tight
              "
            >
              WOODLOOM
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/">Home</Link>

              <Link href="/shop">Shop</Link>

              <Link href="/collections">Collections</Link>

              <Link href="/about">About</Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="p-2">
              <Search size={22} />
            </button>

            <button className="p-2">
              <Heart size={22} />
            </button>

            <button className="p-2 relative">
              <ShoppingBag size={22} />

              <span
                className="
                  absolute
                  -top-1
                  -right-1

                  w-5
                  h-5

                  rounded-full

                  bg-[var(--primary)]
                  text-white

                  text-xs

                  flex
                  items-center
                  justify-center
                "
              >
                2
              </span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
