"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="flex min-w-fit items-center gap-3 rounded-full px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60 lg:rounded-[16px]"
    >
      <LogOut size={18} />
      {isSubmitting ? "Logging out" : "Logout"}
    </button>
  );
}
