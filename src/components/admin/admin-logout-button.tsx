"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function logout() {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin-login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isSigningOut}
      className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSigningOut ? "Signing Out" : "Logout"}
    </button>
  );
}
