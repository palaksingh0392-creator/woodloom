"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Heart, Home, MapPin, Package, User } from "lucide-react";

import LogoutButton from "@/features/auth/components/logout-button";

const accountLinks = [
  {
    href: "/account",
    label: "Overview",
    icon: Home,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/profile",
    label: "Profile",
    icon: User,
  },
];

export default function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mb-10">
        <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
          Customer Account
        </p>

        <h1 className="mb-5 text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
          Your WOODLOOM Space
        </h1>

        <p className="max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          Manage saved pieces, delivery details, profile preferences, and order
          activity. Backend account protection will connect here in the auth
          phase.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          className="
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-4
            lg:sticky
            lg:top-32
            lg:self-start
          "
        >
          <nav className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex
                    min-w-fit
                    items-center
                    gap-3
                    rounded-full
                    px-4
                    py-3
                    text-sm
                    transition-colors
                    lg:rounded-[16px]
                    ${
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            <LogoutButton />
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </section>
  );
}
