import AdminSectionCard from "@/features/admin/components/admin-section-card";
import AdminTaxonomyManager from "@/features/admin/components/admin-taxonomy-manager";
import { listAdminCollections } from "@/lib/admin-taxonomy";

export default async function AdminCollectionsPage() {
  const collections = await listAdminCollections();

  return (
    <AdminSectionCard title="Collection Management">
      <AdminTaxonomyManager
        items={collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description,
          imageUrl: collection.imageUrl,
          isActive: collection.isActive,
          _count: collection._count,
        }))}
        type="collection"
      />
    </AdminSectionCard>
  );
}
