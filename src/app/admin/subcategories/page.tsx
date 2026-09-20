import AdminSectionCard from "@/features/admin/components/admin-section-card";
import AdminSubcategoryManager from "@/features/admin/components/admin-subcategory-manager";
import { listAdminCategories, listAdminSubcategories } from "@/lib/admin-taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminSubcategoriesPage() {
  const [items, categories] = await Promise.all([listAdminSubcategories(), listAdminCategories()]);

  return (
    <AdminSectionCard title="Sub-category Management">
      <AdminSubcategoryManager
        categories={categories.map(({ id, name }) => ({ id, name }))}
        items={items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          categoryId: item.categoryId,
          categoryName: item.category.name,
          isActive: item.isActive,
          sortOrder: item.sortOrder,
          productCount: item._count.products,
        }))}
      />
    </AdminSectionCard>
  );
}
