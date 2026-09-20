"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

 type Subcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
};

type Category = { id: string; name: string };

type Props = { items: Subcategory[]; categories: Category[] };

type Draft = { id?: string; name: string; slug: string; categoryId: string; sortOrder: number; isActive: boolean };

const emptyDraft: Draft = { name: "", slug: "", categoryId: "", sortOrder: 0, isActive: true };
const fieldClass = "h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminSubcategoryManager({ items, categories }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(draft.id ? `/api/admin/subcategories/${draft.id}` : "/api/admin/subcategories", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) {
      setMessage(result.message ?? "Could not save sub-category.");
      return;
    }
    setDraft(emptyDraft);
    router.refresh();
  }

  async function archive(id: string) {
    const response = await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(result.message ?? "Could not archive sub-category.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="grid gap-4 rounded-lg border bg-[var(--surface)] p-4">
        <h2 className="font-serif text-xl font-semibold">{draft.id ? "Edit sub-category" : "Add sub-category"}</h2>
        <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" className={fieldClass} />
        <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="Slug, optional" className={fieldClass} />
        <select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })} className={fieldClass}>
          <option value="">Select category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <input type="number" min={0} value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} placeholder="Sort order" className={fieldClass} />
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} className="h-4 w-4 accent-[var(--primary)]" />Active</label>
        {message ? <p role="alert" className="text-sm text-red-700">{message}</p> : null}
        <div className="flex gap-3"><button type="submit" className="h-11 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white">Save</button>{draft.id ? <button type="button" onClick={() => setDraft(emptyDraft)} className="h-11 rounded-md border px-4 text-sm font-semibold">Cancel</button> : null}</div>
      </form>
      <div className="overflow-x-auto rounded-lg border bg-[var(--surface)]"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs uppercase text-[var(--text-secondary)]"><tr className="border-b"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Products</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b last:border-b-0"><td className="px-4 py-4 font-medium">{item.name}</td><td className="px-4 py-4">{item.categoryName}</td><td className="px-4 py-4">{item.productCount}</td><td className="px-4 py-4">{item.isActive ? "Active" : "Hidden"}</td><td className="px-4 py-4 text-right"><button type="button" onClick={() => setDraft({ id: item.id, name: item.name, slug: item.slug, categoryId: item.categoryId, sortOrder: item.sortOrder, isActive: item.isActive })} className="mr-3 underline">Edit</button><button type="button" onClick={() => archive(item.id)} className="text-red-700 underline">Archive</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
