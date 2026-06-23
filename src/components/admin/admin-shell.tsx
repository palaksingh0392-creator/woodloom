import Link from "next/link";

import {
  Boxes,
  FileText,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  PackageCheck,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: PackageCheck },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/system", label: "System", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-soft)] text-[var(--text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b bg-[var(--surface)] lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b px-5 py-5">
              <Link href="/" className="block">
                <span className="block font-serif text-2xl font-semibold">
                  WOODLOOM
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Admin
                </span>
              </Link>
            </div>

            <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible">
              {adminLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden border-t px-5 py-4 text-xs text-[var(--text-secondary)] lg:block">
              Store operations dashboard
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="border-b bg-[var(--surface)] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Operations
                </p>
                <h1 className="mt-1 font-serif text-3xl font-semibold">
                  Admin Dashboard
                </h1>
              </div>

              <Link
                href="/"
                className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                View storefront
              </Link>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
