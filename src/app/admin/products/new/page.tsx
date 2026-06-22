import AdminProductForm from "@/features/admin/components/admin-product-form";
import { getProductFormOptions } from "@/lib/admin-products";

export default async function NewAdminProductPage() {
  const { categories, collections } = await getProductFormOptions();

  return (
    <AdminProductForm
      categories={categories.map(({ id, name }) => ({ id, name }))}
      collections={collections.map(({ id, name }) => ({ id, name }))}
    />
  );
}
