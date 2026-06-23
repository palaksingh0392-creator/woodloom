"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, MailOpen, RotateCcw } from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

type NewsletterSubscriber = {
  id: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
};

export default function AdminMessagesTable({
  messages,
  subscribers,
}: {
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
}) {
  const router = useRouter();

  async function updateMessage(id: string, status: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function updateSubscriber(id: string, status: string) {
    await fetch(`/api/admin/newsletter/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">Contact messages</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-[var(--text-secondary)]"
                  >
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id} className="border-b last:border-b-0">
                    <td className="max-w-[420px] px-4 py-4 align-top">
                      <strong className="block">{message.subject}</strong>
                      <p className="mt-1 line-clamp-3 text-[var(--text-secondary)]">
                        {message.message}
                      </p>
                      <span className="mt-2 block text-xs text-[var(--text-secondary)]">
                        {new Date(message.createdAt).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="block font-medium">{message.name}</span>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-xs text-[var(--primary)]"
                      >
                        {message.email}
                      </a>
                      {message.phone ? (
                        <span className="block text-xs text-[var(--text-secondary)]">
                          {message.phone}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge status={message.status} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          title="Mark read"
                          onClick={() => updateMessage(message.id, "READ")}
                        >
                          <MailOpen size={16} />
                        </IconButton>
                        <IconButton
                          title="Mark resolved"
                          onClick={() => updateMessage(message.id, "RESOLVED")}
                        >
                          <CheckCircle2 size={16} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">Newsletter</h2>
        </div>

        <div className="divide-y">
          {subscribers.length === 0 ? (
            <p className="p-6 text-sm text-[var(--text-secondary)]">
              No newsletter subscribers yet.
            </p>
          ) : (
            subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-start justify-between gap-4 p-4"
              >
                <div>
                  <p className="font-medium">{subscriber.email}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {subscriber.source} ·{" "}
                    {new Date(subscriber.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={subscriber.status} />
                  </div>
                </div>

                <IconButton
                  title={
                    subscriber.status === "ACTIVE"
                      ? "Unsubscribe"
                      : "Reactivate"
                  }
                  onClick={() =>
                    updateSubscriber(
                      subscriber.id,
                      subscriber.status === "ACTIVE"
                        ? "UNSUBSCRIBED"
                        : "ACTIVE",
                    )
                  }
                >
                  <RotateCcw size={16} />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        normalized === "ACTIVE" || normalized === "RESOLVED"
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : normalized === "NEW"
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
      }`}
    >
      {normalized}
    </span>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
    >
      {children}
    </button>
  );
}
