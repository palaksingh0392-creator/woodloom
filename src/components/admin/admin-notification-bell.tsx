"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, CheckCheck, X } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  href: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  productName?: string | null;
  productImageUrl?: string | null;
};

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<Notification | null>(null);
  const [knownIds, setKnownIds] = useState<Set<string> | null>(null);

  async function loadNotifications() {
    try {
      const response = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { notifications?: Notification[] };
      const nextNotifications = data.notifications ?? [];
      if (knownIds) {
        const freshOrder = nextNotifications.find(
          (notification) =>
            notification.type === "ORDER" &&
            !notification.isRead &&
            !knownIds.has(notification.id),
        );
        if (freshOrder) setNewOrder(freshOrder);
      }
      setKnownIds(new Set(nextNotifications.map((notification) => notification.id)));
      setNotifications(nextNotifications);
    } catch {
      setNotifications((current) => current);
    }
  }

  const pollNotifications = useEffectEvent(() => {
    void loadNotifications();
  });

  useEffect(() => {
    const initialPoll = window.setTimeout(pollNotifications, 0);
    const interval = window.setInterval(pollNotifications, 15000);
    return () => {
      window.clearTimeout(initialPoll);
      window.clearInterval(interval);
    };
  }, []);

  async function markRead(id: string) {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        title="Notifications"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--surface-muted)]"
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border bg-[var(--surface)] p-3 shadow-xl">
          <div className="flex items-center justify-between border-b pb-3">
            <strong>Notifications</strong>
            <div className="flex items-center gap-2">
              <button type="button" onClick={markAllRead} title="Mark all as read" className="text-[var(--primary)]">
                <CheckCheck size={17} />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close notifications" title="Close notifications" className="text-[var(--text-secondary)]">
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-[var(--text-secondary)]">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => {
                    setOpen(false);
                    void markRead(notification.id);
                  }}
                  className={`block border-b px-2 py-3 text-sm last:border-b-0 hover:bg-[var(--surface-muted)] ${notification.isRead ? "opacity-60" : ""}`}
                >
                  {notification.productImageUrl ? (
                    <Image src={notification.productImageUrl} alt="" width={40} height={40} unoptimized className="mr-3 inline-block h-10 w-10 rounded-md object-cover align-top" />
                  ) : null}
                  <span className="inline-block align-top">
                  <strong className="block">{notification.title}</strong>
                  <span className="mt-1 block text-[var(--text-secondary)]">{notification.message}</span>
                  {notification.productName ? <span className="mt-1 block text-xs font-semibold">{notification.productName}</span> : null}
                  <time className="mt-1 block text-xs text-[var(--text-secondary)]">
                    {new Date(notification.createdAt).toLocaleString("en-IN")}
                  </time>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}

      {newOrder ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 px-5">
          <div className="w-full max-w-md rounded-xl border bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[2px] text-[var(--primary)]">New order</p>
                <h2 className="mt-2 font-serif text-2xl">{newOrder.title}</h2>
              </div>
              <button type="button" onClick={() => setNewOrder(null)} aria-label="Close new order alert"><X size={18} /></button>
            </div>
            {newOrder.productImageUrl ? <Image src={newOrder.productImageUrl} alt="" width={480} height={160} unoptimized className="mt-5 h-40 w-full rounded-lg object-cover" /> : null}
            <p className="mt-4 text-sm text-[var(--text-secondary)]">{newOrder.message}</p>
            <button type="button" onClick={() => { setNewOrder(null); setOpen(true); }} className="mt-5 h-11 rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-white">Open notification</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}