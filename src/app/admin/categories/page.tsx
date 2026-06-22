import AdminSectionCard from "@/features/admin/components/admin-section-card";
import AdminTaxonomyManager from "@/features/admin/components/admin-taxonomy-manager";
import { listAdminCategories } from "@/lib/admin-taxonomy";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <AdminSectionCard title="Category Management">
      <AdminTaxonomyManager
        items={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.imageUrl,
          isActive: category.isActive,
          sortOrder: category.sortOrder,
          _count: category._count,
        }))}
        type="category"
      />
    </AdminSectionCard>
  );
}
