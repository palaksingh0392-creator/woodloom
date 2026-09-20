import AdminNavigationManager, { type NavigationLinkItem } from "@/features/admin/components/admin-navigation-manager";
import { getProductFormOptions } from "@/lib/admin-products";
import { listNavigationLinks } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const [links, options] = await Promise.all([
    listNavigationLinks({ activeOnly: false }),
    getProductFormOptions(),
  ]);
  return <div className="space-y-6"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Storefront settings</p><h1 className="font-serif text-3xl font-semibold">Navbar links</h1></div><AdminNavigationManager initialLinks={links satisfies NavigationLinkItem[]} categories={options.categories.map(({ id, name, slug }) => ({ id, name, slug }))} subcategories={options.subcategories.map(({ id, name, slug, categoryId }) => ({ id, name, slug, categoryId }))} collections={options.collections.map(({ id, name, slug }) => ({ id, name, slug }))} /></div>;
}
