"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type Option = { id: string; name: string };
type Variant = {
  id?: string;
  finish: string;
  color: string;
  sku: string;
  stock: number;
  reorderAt: number;
};

export type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  collectionId: string;
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string;
  careInstructions: string;
  warranty: string;
  price: number;
  compareAtPrice: number | "";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  badge: string;
  imageUrls: string[];
  variants: Variant[];
};

type Props = {
  categories: Option[];
  collections: Option[];
  initialValue?: ProductFormValue;
};

const emptyVariant: Variant = {
  finish: "",
  color: "",
  sku: "",
  stock: 0,
  reorderAt: 5,
};

function createInitialValue(categories: Option[]): ProductFormValue {
  return {
    name: "",
    slug: "",
    sku: "",
    categoryId: categories[0]?.id ?? "",
    collectionId: "",
    shortDescription: "",
    description: "",
    material: "",
    dimensions: "",
    careInstructions: "",
    warranty: "",
    price: 0,
    compareAtPrice: "",
    status: "DRAFT",
    isFeatured: false,
    badge: "",
    imageUrls: [],
    variants: [{ ...emptyVariant }],
  };
}

const fieldClass =
  "mt-2 min-h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition focus:border-[var(--primary)]";
const labelClass = "block text-sm font-semibold text-[var(--text-primary)]";

export default function AdminProductForm({
  categories,
  collections,
  initialValue,
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState<ProductFormValue>(
    initialValue ?? createInitialValue(categories),
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const isEditing = Boolean(value.id);
  const totalStock = useMemo(
    () => value.variants.reduce((sum, variant) => sum + Number(variant.stock), 0),
    [value.variants],
  );

  function updateField<Key extends keyof ProductFormValue>(
    key: Key,
    nextValue: ProductFormValue[Key],
  ) {
    setValue((current) => ({ ...current, [key]: nextValue }));
  }

  function updateVariant(index: number, patch: Partial<Variant>) {
    setValue((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...patch } : variant,
      ),
    }));
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url || value.imageUrls.includes(url)) return;
    updateField("imageUrls", [...value.imageUrls, url]);
    setImageUrl("");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.message ?? "Image upload failed.");
      }

      updateField("imageUrls", [...value.imageUrls, result.url]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        isEditing ? `/api/admin/products/${value.id}` : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        },
      );
      const result = (await response.json()) as {
        product?: { id: string };
        message?: string;
      };

      if (!response.ok || !result.product) {
        throw new Error(result.message ?? "Could not save product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={saveProduct} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"
        >
          <ArrowLeft size={17} />
          Products
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">
            Total stock: <strong className="text-[var(--text-primary)]">{totalStock}</strong>
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={17} />
            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      {message ? (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <FormSection title="Basic information">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                Product name
                <input
                  required
                  value={value.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className={labelClass}>
                URL slug
                <input
                  value={value.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="Generated from product name"
                  className={fieldClass}
                />
              </label>
              <label className={labelClass}>
                Product SKU
                <input
                  required
                  value={value.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className={labelClass}>
                Category
                <select
                  required
                  value={value.categoryId}
                  onChange={(event) => updateField("categoryId", event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Collection
                <select
                  value={value.collectionId}
                  onChange={(event) => updateField("collectionId", event.target.value)}
                  className={fieldClass}
                >
                  <option value="">No collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Badge
                <input
                  value={value.badge}
                  onChange={(event) => updateField("badge", event.target.value)}
                  placeholder="New, Bestseller, Limited"
                  className={fieldClass}
                />
              </label>
            </div>

            <label className={labelClass}>
              Short description
              <textarea
                required
                rows={3}
                value={value.shortDescription}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Full description
              <textarea
                required
                rows={6}
                value={value.description}
                onChange={(event) => updateField("description", event.target.value)}
                className={fieldClass}
              />
            </label>
          </FormSection>

          <FormSection title="Specifications">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["material", "Material"],
                ["dimensions", "Dimensions"],
                ["warranty", "Warranty"],
                ["careInstructions", "Care instructions"],
              ].map(([key, label]) => (
                <label key={key} className={labelClass}>
                  {label}
                  <textarea
                    rows={3}
                    value={value[key as keyof ProductFormValue] as string}
                    onChange={(event) =>
                      updateField(
                        key as
                          | "material"
                          | "dimensions"
                          | "warranty"
                          | "careInstructions",
                        event.target.value,
                      )
                    }
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection
            title="Finishes and inventory"
            action={
              <button
                type="button"
                onClick={() =>
                  updateField("variants", [...value.variants, { ...emptyVariant }])
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
              >
                <Plus size={16} />
                Add finish
              </button>
            }
          >
            <div className="space-y-4">
              {value.variants.map((variant, index) => (
                <div
                  key={variant.id ?? index}
                  className="grid gap-3 rounded-md border border-[var(--border)] p-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.2fr_0.7fr_0.7fr_auto]"
                >
                  <SmallField
                    label="Finish"
                    value={variant.finish}
                    onChange={(nextValue) =>
                      updateVariant(index, { finish: nextValue })
                    }
                  />
                  <SmallField
                    label="Color"
                    value={variant.color}
                    onChange={(nextValue) =>
                      updateVariant(index, { color: nextValue })
                    }
                  />
                  <SmallField
                    label="Variant SKU"
                    value={variant.sku}
                    onChange={(nextValue) => updateVariant(index, { sku: nextValue })}
                  />
                  <SmallField
                    label="Stock"
                    type="number"
                    min={0}
                    value={variant.stock}
                    onChange={(nextValue) =>
                      updateVariant(index, { stock: Number(nextValue) })
                    }
                  />
                  <SmallField
                    label="Reorder at"
                    type="number"
                    min={0}
                    value={variant.reorderAt}
                    onChange={(nextValue) =>
                      updateVariant(index, { reorderAt: Number(nextValue) })
                    }
                  />
                  <button
                    type="button"
                    title="Remove finish"
                    disabled={value.variants.length === 1 || Boolean(variant.id)}
                    onClick={() =>
                      updateField(
                        "variants",
                        value.variants.filter((_, variantIndex) => variantIndex !== index),
                      )
                    }
                    className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-md border text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Publishing">
            <label className={labelClass}>
              Status
              <select
                value={value.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as ProductFormValue["status"],
                  )
                }
                className={fieldClass}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={value.isFeatured}
                onChange={(event) => updateField("isFeatured", event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Feature on storefront
            </label>
          </FormSection>

          <FormSection title="Pricing">
            <label className={labelClass}>
              Selling price (Rs.)
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={value.price}
                onChange={(event) => updateField("price", Number(event.target.value))}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Compare-at price (Rs.)
              <input
                type="number"
                min={0}
                step="0.01"
                value={value.compareAtPrice}
                onChange={(event) =>
                  updateField(
                    "compareAtPrice",
                    event.target.value === "" ? "" : Number(event.target.value),
                  )
                }
                className={fieldClass}
              />
            </label>
          </FormSection>

          <FormSection title="Product images">
            <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)]">
              <Upload size={22} />
              {isUploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={(event) => uploadImage(event.target.files?.[0])}
                className="sr-only"
              />
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Or paste image URL"
                className={`${fieldClass} mt-0`}
              />
              <button
                type="button"
                title="Add image URL"
                onClick={addImageUrl}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[var(--border)]"
              >
                <ImagePlus size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {value.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-md bg-[var(--surface-muted)] bg-cover bg-center"
                  style={{ backgroundImage: `url("${url.replaceAll('"', "%22")}")` }}
                >
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() =>
                      updateField(
                        "imageUrls",
                        value.imageUrls.filter((_, imageIndex) => imageIndex !== index),
                      )
                    }
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-white"
                  >
                    <Trash2 size={15} />
                  </button>
                  {index === 0 ? (
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      Cover
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </FormSection>
        </div>
      </div>
    </form>
  );
}

function FormSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        {action}
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

function SmallField({
  label,
  type = "text",
  min,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  min?: number;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-semibold text-[var(--text-secondary)]">
      {label}
      <input
        required
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}
