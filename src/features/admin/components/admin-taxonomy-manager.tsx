"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil, Plus, Save, Trash2, X } from "lucide-react";

type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  filters?: string;
  isActive: boolean;
  sortOrder?: number;
  _count: { products: number };
};

type Draft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  filters: string;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  items: TaxonomyItem[];
  type: "category" | "collection";
};

const emptyDraft: Draft = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  filters: "",
  isActive: true,
  sortOrder: 0,
};

const fieldClass =
  "h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminTaxonomyManager({ items, type }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const plural = type === "category" ? "categories" : "collections";
  const endpoint = `/api/admin/${plural}`;

  async function readResponse(response: Response) {
    const text = await response.text();
    try {
      return JSON.parse(text) as { message?: string };
    } catch {
      throw new Error(
        response.status === 404
          ? `The ${type} endpoint was not found.`
          : `The ${type} request failed (${response.status}).`,
      );
    }
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;

    setIsUploadingImage(true);
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

      const imageUrl = result.url;
      setDraft((current) => ({ ...current, imageUrl }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function editItem(item: TaxonomyItem) {
    setDraft({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      filters: item.filters ?? "",
      isActive: item.isActive,
      sortOrder: item.sortOrder ?? 0,
    });
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(draft.id ? `${endpoint}/${draft.id}` : endpoint, {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = await readResponse(response);

    setIsSaving(false);

    if (!response.ok) {
      setMessage(result.message ?? `Could not save ${type}.`);
      return;
    }

    setDraft(emptyDraft);
    router.refresh();
  }

  async function deactivateItem(id: string) {
    setMessage("");
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await readResponse(response).catch(() => ({ message: undefined }));
      setMessage(result.message ?? `Could not archive ${type}.`);
      return;
    }
    router.refresh();
  }

  async function deleteItem(item: TaxonomyItem) {
    if (!window.confirm(`Delete ${item.name} permanently?`)) return;

    setMessage("");
    const response = await fetch(`${endpoint}/${item.id}?hard=true`, { method: "DELETE" });
    if (!response.ok) {
      const result = await readResponse(response).catch(() => ({ message: undefined }));
      setMessage(result.message ?? `Could not delete ${type}. Remove its products first.`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">
            {draft.id ? `Edit ${type}` : `Add ${type}`}
          </h2>
        </div>

        <form onSubmit={saveItem} className="grid gap-4 p-4">
          <input
            required
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Name"
            className={fieldClass}
          />
          <input
            value={draft.slug}
            onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
            placeholder="Slug, optional"
            className={fieldClass}
          />
          {type === "category" ? (
            <input
              type="number"
              min={0}
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft({ ...draft, sortOrder: Number(event.target.value) })
              }
              placeholder="Sort order"
              className={fieldClass}
            />
          ) : null}
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--border)] px-3 py-3 text-center text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)]">
            <span>{isUploadingImage ? "Uploading..." : `Upload ${type} image`}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingImage}
              onChange={(event) => uploadImage(event.target.files?.[0])}
              className="sr-only"
            />
          </label>
          {draft.imageUrl ? (
            <div className="overflow-hidden rounded-md border border-[var(--border)]">
              <Image
                src={draft.imageUrl}
                alt={`${type} preview`}
                width={800}
                height={200}
                className="h-28 w-full object-cover"
              />
            </div>
          ) : null}
          <textarea
            rows={4}
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
            placeholder="Description"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          {type === "category" ? (
            <input
              value={draft.filters}
              onChange={(event) => setDraft({ ...draft, filters: event.target.value })}
              placeholder="Filters, comma separated (Oak, Linen, Storage)"
              className={fieldClass}
            />
          ) : null}
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) =>
                setDraft({ ...draft, isActive: event.target.checked })
              }
              className="accent-[var(--primary)]"
            />
            Active
          </label>

          {message ? (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {draft.id ? <Save size={16} /> : <Plus size={16} />}
              {isSaving ? "Saving..." : draft.id ? "Save changes" : "Create"}
            </button>
            {draft.id ? (
              <button
                type="button"
                onClick={() => setDraft(emptyDraft)}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border)] px-4 text-sm font-semibold"
              >
                <X size={16} />
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">
            Existing {plural}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Products</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-semibold">{item.name}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {item.slug}
                  </td>
                  <td className="px-4 py-4">{item._count.products}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title={`Edit ${item.name}`}
                        onClick={() => editItem(item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Deactivate ${item.name}`}
                        disabled={!item.isActive}
                        onClick={() => deactivateItem(item.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600 disabled:opacity-30"
                      >
                        <Archive size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Delete ${item.name}`}
                        onClick={() => deleteItem(item)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
