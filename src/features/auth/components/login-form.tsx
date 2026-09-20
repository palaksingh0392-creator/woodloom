"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  formatPhoneInput,
  isValidLoginIdentifier,
} from "@/lib/account-validation";

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

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") ?? "").trim();

    if (!isValidLoginIdentifier(identifier)) {
      setMessage("Enter a valid email or a +91 mobile number with 10 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
          portal,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        user?: { role?: string };
      };

      if (!response.ok) {
        if (response.status === 401) {
          setMessage(data.message ?? "Invalid email/phone or password.");
          return;
        }

        if (response.status === 403 || response.status === 409) {
          setMessage(data.message ?? "This account is not allowed to access this area.");
          return;
        }

        if (response.status >= 500) {
          setMessage("Login server is not working right now. Please try again shortly.");
          return;
        }

        setMessage(
          data.message ??
            "Login server is not working right now. Please try again shortly.",
        );
        return;
      }

      const destination =
        redirectTo ??
        (data.user?.role === "ADMIN" || data.user?.role === "STAFF"
          ? "/admin"
          : "/account");

      router.push(destination);
      router.refresh();
    } catch {
      setMessage("Login server is not reachable. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <AuthField
        id="identifier"
        name="identifier"
        label="Email or phone"
        type="text"
        placeholder="you@example.com or +91 98765 43210"
        onChange={(event) => {
          const raw = event.target.value;
          const next = /[a-z@]/i.test(raw) ? raw : formatPhoneInput(raw);
          event.target.value = next;
        }}
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
