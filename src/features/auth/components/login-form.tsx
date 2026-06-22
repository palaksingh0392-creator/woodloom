"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthField from "./auth-field";

type LoginFormProps = {
  portal?: "customer" | "admin";
  redirectTo?: string;
};

export default function LoginForm({
  portal = "customer",
  redirectTo,
}: LoginFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        portal,
      }),
    });
    const data = (await response.json()) as {
      message?: string;
      user?: { role?: string };
    };

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to login right now.");
      return;
    }

    const destination =
      redirectTo ??
      (data.user?.role === "ADMIN" || data.user?.role === "STAFF"
        ? "/admin"
        : "/account");

    router.push(destination);
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <AuthField
        id="email"
        name="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        required
      />

      <AuthField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        required
      />

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-[var(--text-secondary)]">
          <input name="remember" type="checkbox" className="accent-[var(--primary)]" />
          Remember me
        </label>

        <Link href="/forgot-password" className="text-[var(--primary)]">
          Forgot password?
        </Link>
      </div>

      {message && (
        <p className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging In" : "Login"}
      </button>

      <Link
        href="/verify-otp"
        className="flex h-14 items-center justify-center rounded-full border border-[var(--border)] text-sm uppercase tracking-[2px]"
      >
        Login With Email OTP
      </Link>
    </form>
  );
}
