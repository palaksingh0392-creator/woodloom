"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Archive, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { HOME_HERO_WORD_LIMITS } from "@/constants/home";
import type { HomeHeroSlide } from "@/lib/home";

import { readAdminResponse } from "./read-admin-response";

type Draft = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyDraft: Draft = {
  eyebrow: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  primaryCtaLabel: "Explore Collection",
  primaryCtaHref: "/furniture",
  secondaryCtaLabel: "Book Consultation",
  secondaryCtaHref: "/contact",
  isActive: true,
  sortOrder: 0,
};

const fieldClass =
  "h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export default function HomeHeroManager({ slides }: { slides: HomeHeroSlide[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      const result = await readAdminResponse<{ url?: string; message?: string }>(
        response,
      );

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

  function editSlide(slide: HomeHeroSlide) {
    setDraft({
      id: slide.id,
      eyebrow: slide.eyebrow,
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      primaryCtaLabel: slide.primaryCtaLabel,
      primaryCtaHref: slide.primaryCtaHref,
      secondaryCtaLabel: slide.secondaryCtaLabel,
      secondaryCtaHref: slide.secondaryCtaHref,
      isActive: slide.isActive,
      sortOrder: slide.sortOrder,
    });
  }

  async function saveSlide(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      countWords(draft.eyebrow) > HOME_HERO_WORD_LIMITS.eyebrow ||
      countWords(draft.title) > HOME_HERO_WORD_LIMITS.title ||
      countWords(draft.subtitle) > HOME_HERO_WORD_LIMITS.subtitle
    ) {
      setMessage("Please shorten the hero copy to fit the word limits.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        draft.id ? `/api/admin/home/${draft.id}` : "/api/admin/home",
        {
          method: draft.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const result = await readAdminResponse<{ message?: string }>(response);

      if (!response.ok) {
        setMessage(result.message ?? "Could not save slide.");
        return;
      }

      setDraft(emptyDraft);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save slide.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateSlide(id: string) {
    await fetch(`/api/admin/home/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteSlide(slide: HomeHeroSlide) {
    if (!window.confirm(`Delete "${slide.title}" permanently?`)) return;

    const response = await fetch(`/api/admin/home/${slide.id}?hard=true`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setMessage("Could not delete hero slide.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">
            {draft.id ? "Edit hero slide" : "Add hero slide"}
          </h2>
        </div>

        <form onSubmit={saveSlide} className="grid gap-4 p-4">
          <input
            value={draft.eyebrow}
            onChange={(event) => setDraft({ ...draft, eyebrow: event.target.value })}
            placeholder="Eyebrow"
            className={fieldClass}
          />
          <p className="-mt-3 text-xs text-[var(--text-secondary)]">
            {countWords(draft.eyebrow)}/{HOME_HERO_WORD_LIMITS.eyebrow} words
          </p>
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="Title"
            className={fieldClass}
          />
          <p className="-mt-3 text-xs text-[var(--text-secondary)]">
            {countWords(draft.title)}/{HOME_HERO_WORD_LIMITS.title} words
          </p>
          <textarea
            rows={3}
            value={draft.subtitle}
            onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })}
            placeholder="Subtitle"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <p className="-mt-3 text-xs text-[var(--text-secondary)]">
            {countWords(draft.subtitle)}/{HOME_HERO_WORD_LIMITS.subtitle} words
          </p>
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--border)] px-3 py-3 text-center text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)]">
            <span>{isUploadingImage ? "Uploading..." : "Upload hero image"}</span>
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
                alt="Hero preview"
                width={800}
                height={320}
                className="h-32 w-full object-cover"
              />
            </div>
          ) : null}
          <input
            value={draft.primaryCtaLabel}
            onChange={(event) => setDraft({ ...draft, primaryCtaLabel: event.target.value })}
            placeholder="Primary button label"
            className={fieldClass}
          />
          <input
            value={draft.primaryCtaHref}
            onChange={(event) => setDraft({ ...draft, primaryCtaHref: event.target.value })}
            placeholder="Primary button link"
            className={fieldClass}
          />
          <input
            value={draft.secondaryCtaLabel}
            onChange={(event) => setDraft({ ...draft, secondaryCtaLabel: event.target.value })}
            placeholder="Secondary button label"
            className={fieldClass}
          />
          <input
            value={draft.secondaryCtaHref}
            onChange={(event) => setDraft({ ...draft, secondaryCtaHref: event.target.value })}
            placeholder="Secondary button link"
            className={fieldClass}
          />
          <input
            type="number"
            min={0}
            value={draft.sortOrder}
            onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
            placeholder="Sort order"
            className={fieldClass}
          />
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
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

      <section className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">Existing hero slides</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] table-fixed text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="w-[36%] px-3 py-3 font-semibold">Title</th>
                <th className="w-[34%] px-3 py-3 font-semibold">Text</th>
                <th className="w-[14%] px-3 py-3 font-semibold">Status</th>
                <th className="w-[16%] whitespace-nowrap px-3 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id} className="border-b last:border-b-0 align-top">
                  <td className="break-words px-3 py-4 font-semibold">{slide.title}</td>
                  <td className="break-words px-3 py-4 text-[var(--text-secondary)]">
                    <div className="max-w-[260px] space-y-1">
                      <p className="uppercase tracking-[2px] text-[11px] text-[var(--primary)]">
                        {slide.eyebrow}
                      </p>
                      <p>{slide.subtitle}</p>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        slide.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title={`Edit ${slide.title}`}
                        onClick={() => editSlide(slide)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Deactivate ${slide.title}`}
                        disabled={!slide.isActive}
                        onClick={() => deactivateSlide(slide.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100 disabled:opacity-30"
                      >
                        <Archive size={16} />
                      </button>
                      <button
                        type="button"
                        title={`Delete ${slide.title}`}
                        onClick={() => deleteSlide(slide)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
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
