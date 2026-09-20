"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function HomeAuthPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;

    function showAfterFirstInteraction() {
      if (!active) return;
      active = false;
      setVisible(true);
      document.removeEventListener("click", showAfterFirstInteraction);
      document.removeEventListener("scroll", showAfterFirstInteraction);
    }

    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { user?: unknown }) => {
        if (!data.user && active) {
          document.addEventListener("click", showAfterFirstInteraction, { once: true });
          document.addEventListener("scroll", showAfterFirstInteraction, {
            once: true,
            passive: true,
          });
        }
      })
      .catch(() => {
        active = false;
      });

    return () => {
      active = false;
      document.removeEventListener("click", showAfterFirstInteraction);
      document.removeEventListener("scroll", showAfterFirstInteraction);
    };
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 px-5" role="dialog" aria-modal="true" aria-label="Account access">
      <div className="relative w-full max-w-md rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">
        <button type="button" onClick={dismiss} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 hover:bg-[var(--surface-muted)]">
          <X size={18} />
        </button>
        <p className="mb-3 text-sm uppercase tracking-[3px] text-[var(--primary)]">Welcome to Shissoo</p>
        <h2 className="mb-3 font-serif text-3xl">Save your favourites and orders</h2>
        <p className="mb-7 text-sm leading-relaxed text-[var(--text-secondary)]">Log in or create an account for faster checkout and order tracking.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" onClick={dismiss} className="inline-flex h-12 items-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white">Log in</Link>
          <Link href="/register" onClick={dismiss} className="inline-flex h-12 items-center rounded-full border border-[var(--border)] px-6 text-sm font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
}