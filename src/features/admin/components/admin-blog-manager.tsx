"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ExternalLink, Pencil, Plus, Save, X } from "lucide-react";

type BlogItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
};

type Draft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  isPublished: boolean;
};

const emptyDraft: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  author: "Guide",
  isPublished: false,
};

const fieldClass =
  "h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminBlogManager({ posts }: { posts: BlogItem[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function editPost(post: BlogItem) {
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl ?? "",
      author: post.author,
      isPublished: post.isPublished,
    });
  }

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch(
      draft.id ? `/api/admin/blogs/${draft.id}` : "/api/admin/blogs",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      },
    );
    const result = (await response.json()) as { message?: string };

    setIsSaving(false);

    if (!response.ok) {
      setMessage(result.message ?? "Could not save blog post.");
      return;
    }

    setDraft(emptyDraft);
    router.refresh();
  }

  async function unpublishPost(id: string) {
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">
            {draft.id ? "Edit article" : "Create article"}
          </h2>
        </div>

        <form onSubmit={savePost} className="grid gap-4 p-4">
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="Title"
            className={fieldClass}
          />
          <input
            value={draft.slug}
            onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
            placeholder="Slug, optional"
            className={fieldClass}
          />
          <input
            value={draft.author}
            onChange={(event) => setDraft({ ...draft, author: event.target.value })}
            placeholder="Category label, e.g. Guide"
            className={fieldClass}
          />
          <input
            value={draft.imageUrl}
            onChange={(event) =>
              setDraft({ ...draft, imageUrl: event.target.value })
            }
            placeholder="Image URL"
            className={fieldClass}
          />
          <textarea
            required
            rows={3}
            value={draft.excerpt}
            onChange={(event) =>
              setDraft({ ...draft, excerpt: event.target.value })
            }
            placeholder="Short excerpt"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <textarea
            required
            rows={12}
            value={draft.content}
            onChange={(event) =>
              setDraft({ ...draft, content: event.target.value })
            }
            placeholder="Article content. Separate paragraphs with blank lines."
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.isPublished}
              onChange={(event) =>
                setDraft({ ...draft, isPublished: event.target.checked })
              }
              className="accent-[var(--primary)]"
            />
            Publish article
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
          <h2 className="font-serif text-xl font-semibold">Journal articles</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">Article</th>
                <th className="px-4 py-3 font-semibold">Label</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    No database articles yet. Static fallback posts still show on the public blog.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b last:border-b-0">
                    <td className="px-4 py-4">
                      <strong className="block">{post.title}</strong>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {post.slug}
                      </span>
                    </td>
                    <td className="px-4 py-4">{post.author}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          post.isPublished
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--text-secondary)]">
                      {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {post.isPublished ? (
                          <Link
                            href={`/blog/${post.slug}`}
                            title="Preview article"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          title={`Edit ${post.title}`}
                          onClick={() => editPost(post)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title={`Unpublish ${post.title}`}
                          disabled={!post.isPublished}
                          onClick={() => unpublishPost(post.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600 disabled:opacity-30"
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
