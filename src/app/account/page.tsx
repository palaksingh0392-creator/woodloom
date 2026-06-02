import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import AccountShell from "@/features/account/components/account-shell";
import { requireCustomerSession } from "@/lib/session";

export const metadata = {
  title: "Account | WOODLOOM",
  description: "Manage your WOODLOOM customer account.",
};

const stats = [
  {
    label: "Saved Pieces",
    value: "Wishlist",
    href: "/account/wishlist",
  },
  {
    label: "Recent Orders",
    value: "Orders",
    href: "/account/orders",
  },
  {
    label: "Delivery Details",
    value: "Addresses",
    href: "/account/addresses",
  },
];

export default async function AccountPage() {
  const session = await requireCustomerSession();

  return (
    <MainLayout>
      <AccountShell>
        <div className="grid gap-6">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="mb-3 text-sm uppercase tracking-[3px] text-[var(--primary)]">
              Overview
            </p>
            <h2 className="mb-4 text-4xl leading-tight">
              Welcome back, {session.name}
            </h2>
            <p className="max-w-[640px] text-[var(--text-secondary)]">
              Your protected account area is now connected to signed sessions.
              Manage profile details, delivery addresses, saved pieces, and
              order activity from here.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {stats.map((stat) => (
              <Link
                key={stat.href}
                href={stat.href}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform hover:-translate-y-1"
              >
                <p className="mb-3 text-sm text-[var(--text-secondary)]">
                  {stat.label}
                </p>
                <h3 className="text-3xl">{stat.value}</h3>
              </Link>
            ))}
          </div>
        </div>
      </AccountShell>
    </MainLayout>
  );
}
