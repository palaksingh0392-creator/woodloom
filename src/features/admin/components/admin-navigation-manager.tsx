"use client";

import { useState } from "react";
import { Archive, Link2, Pencil, Save, Trash2, X } from "lucide-react";

export type NavigationLinkItem = {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  sortOrder: number;
};

type TaxonomyOption = { id: string; name: string; slug: string; categoryId?: string };

type Draft = Omit<NavigationLinkItem, "id" | "href"> & {
  id?: string;
  href: string;
  targetType: "custom" | "category" | "subcategory" | "collection";
  categoryId: string;
  subcategoryId: string;
  collectionId: string;
};

const emptyDraft: Draft = {
  label: "",
  href: "",
  isActive: true,
  sortOrder: 0,
  targetType: "custom",
  categoryId: "",
  subcategoryId: "",
  collectionId: "",
};

const fieldClass = "h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminNavigationManager({
  initialLinks,
  categories,
  subcategories,
  collections,
}: {
  initialLinks: NavigationLinkItem[];
  categories: TaxonomyOption[];
  subcategories: TaxonomyOption[];
  collections: TaxonomyOption[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const availableSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === draft?.categoryId,
  );

  function openNewDraft() {
    setMessage("");
    setDraft({ ...emptyDraft, sortOrder: links.length });
  }

  function openEditDraft(link: NavigationLinkItem) {
    setMessage("");
    setDraft({ ...emptyDraft, ...link, targetType: "custom" });
  }

  async function saveLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      if (!draft) return;

      const destination =
        draft.targetType === "category"
          ? `/furniture/${categories.find((item) => item.id === draft.categoryId)?.slug ?? ""}`
          : draft.targetType === "subcategory"
            ? `/furniture/${categories.find((item) => item.id === draft.categoryId)?.slug ?? ""}?subcategory=${subcategories.find((item) => item.id === draft.subcategoryId)?.slug ?? ""}`
            : draft.targetType === "collection"
              ? `/products?collection=${collections.find((item) => item.id === draft.collectionId)?.slug ?? ""}`
              : draft.href;
      const payload = { ...draft, href: destination, sortOrder: Number(draft.sortOrder) };

      const response = await fetch(
        draft.id ? `/api/admin/navigation/${draft.id}` : "/api/admin/navigation",
        {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as { link?: NavigationLinkItem; message?: string };
      if (!response.ok || !result.link) throw new Error(result.message ?? "Could not save navigation link.");
      setLinks((current) =>
        draft.id
          ? current.map((link) => (link.id === draft.id ? result.link! : link))
          : [...current, result.link!].sort((left, right) => left.sortOrder - right.sortOrder),
      );
      setDraft(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save navigation link.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateLink(id: string) {
    const link = links.find((item) => item.id === id);
    if (!link || !link.isActive) return;

    const response = await fetch(`/api/admin/navigation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...link, isActive: false }),
    });
    const result = (await response.json()) as { link?: NavigationLinkItem; message?: string };
    if (!response.ok || !result.link) {
      setMessage(result.message ?? "Could not deactivate navigation link.");
      return;
    }
    setLinks((current) => current.map((item) => item.id === id ? result.link! : item));
  }

  async function deleteLink(id: string) {
    if (!window.confirm("Delete this navigation link permanently?")) return;

    const response = await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(result.message ?? "Could not delete navigation link.");
      return;
    }
    setLinks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="grid gap-6">
      {draft ? <section className="rounded-lg border bg-[var(--surface)]">
        <div className="flex items-center gap-2 border-b px-4 py-3"><Link2 className="h-4 w-4 text-[var(--primary)]" /><h2 className="font-serif text-xl font-semibold">Edit nav link</h2></div>
        <form onSubmit={saveLink} className="grid gap-4 p-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Label<input required value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} placeholder="Living Room" className={`${fieldClass} mt-2`} /></label>
          <label className="text-sm font-semibold">Destination type<select value={draft.targetType} onChange={(event) => setDraft({ ...draft, targetType: event.target.value as Draft["targetType"] })} className={`${fieldClass} mt-2`}><option value="custom">Custom page path</option><option value="category">Category</option><option value="subcategory">Sub-category</option><option value="collection">Collection</option></select></label>
          {draft.targetType === "custom" ? <label className="text-sm font-semibold">Page path<input required value={draft.href} onChange={(event) => setDraft({ ...draft, href: event.target.value })} placeholder="/about" className={`${fieldClass} mt-2`} /></label> : null}
          {draft.targetType === "category" || draft.targetType === "subcategory" ? <label className="text-sm font-semibold">Category<select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value, subcategoryId: "" })} className={`${fieldClass} mt-2`}><option value="">Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}
          {draft.targetType === "subcategory" ? <label className="text-sm font-semibold">Sub-category<select required value={draft.subcategoryId} onChange={(event) => setDraft({ ...draft, subcategoryId: event.target.value })} className={`${fieldClass} mt-2`}><option value="">Select sub-category</option>{availableSubcategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}
          {draft.targetType === "collection" ? <label className="text-sm font-semibold">Collection<select required value={draft.collectionId} onChange={(event) => setDraft({ ...draft, collectionId: event.target.value })} className={`${fieldClass} mt-2`}><option value="">Select collection</option>{collections.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : null}
          <label className="text-sm font-semibold">Sort order<input required type="number" min={0} value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} className={`${fieldClass} mt-2`} /></label>
          <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} className="h-4 w-4 accent-[var(--primary)]" />Active link</label>
          {message ? <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p> : null}
          <div className="flex gap-3 md:col-span-2"><button type="submit" disabled={isSaving} className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white disabled:opacity-60"><Save size={16} />{isSaving ? "Saving..." : "Save changes"}</button><button type="button" onClick={() => setDraft(null)} className="inline-flex h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold"><X size={16} />Cancel</button></div>
        </form>
      </section> : null}
      <section className="rounded-lg border bg-[var(--surface)]"><div className="flex items-center justify-between border-b px-4 py-3"><h2 className="font-serif text-xl font-semibold">Navbar links</h2><button type="button" onClick={openNewDraft} className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-sm font-semibold text-white"><Link2 size={16} />Add link</button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs uppercase text-[var(--text-secondary)]"><tr className="border-b"><th className="px-4 py-3">Label</th><th className="px-4 py-3">Destination</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{links.map((link) => <tr key={link.id} className="border-b last:border-b-0"><td className="px-4 py-4 font-medium">{link.label}</td><td className="px-4 py-4">{link.href}</td><td className="px-4 py-4">{link.sortOrder}</td><td className="px-4 py-4"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">{link.isActive ? "Active" : "Hidden"}</span></td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" title="Edit link" onClick={() => openEditDraft(link)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border"><Pencil size={16} /></button><button type="button" title="Deactivate link" onClick={() => deactivateLink(link.id)} disabled={!link.isActive} className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-red-600 disabled:opacity-30"><Archive size={16} /></button><button type="button" title="Delete link" onClick={() => deleteLink(link.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-red-600"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></section>
    </div>
  );
}
