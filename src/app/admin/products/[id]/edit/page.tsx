import { notFound } from "next/navigation";

import AdminProductForm, {
  type ProductFormValue,
} from "@/features/admin/components/admin-product-form";
import {
  getAdminProduct,
  getProductFormOptions,
} from "@/lib/admin-products";

type Props = { params: Promise<{ id: string }> };

export default async function EditAdminProductPage({ params }: Props) {
  const { id } = await params;
  const [product, options] = await Promise.all([
    getAdminProduct(id),
    getProductFormOptions(),
  ]);

  if (!product) notFound();

  const initialValue: ProductFormValue = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    categoryId: product.categoryId,
    collectionId: product.collectionId ?? "",
    shortDescription: product.shortDescription,
    description: product.description,
    material: product.material ?? "",
    dimensions: product.dimensions ?? "",
    careInstructions: product.careInstructions ?? "",
    warranty: product.warranty ?? "",
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : "",
    status: product.status as ProductFormValue["status"],
    isFeatured: product.isFeatured,
    badge: product.badge ?? "",
    imageUrls: product.images.map((image) => image.url),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      finish: variant.finish,
      color: variant.color ?? "",
      sku: variant.sku,
      stock: variant.stock,
      reorderAt: variant.reorderAt,
    })),
  };

  return (
    <AdminProductForm
      categories={options.categories.map(({ id: optionId, name }) => ({
        id: optionId,
        name,
      }))}
      collections={options.collections.map(({ id: optionId, name }) => ({
        id: optionId,
        name,
      }))}
      initialValue={initialValue}
    />
  );
}
