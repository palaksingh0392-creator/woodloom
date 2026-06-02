"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthField from "./auth-field";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to create account right now.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <AuthField
        id="name"
        name="name"
        label="Full name"
        type="text"
        placeholder="Your name"
        required
      />

      <AuthField
        id="email"
        name="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        required
      />

      <AuthField
        id="phone"
        name="phone"
        label="Phone number"
        type="tel"
        placeholder="+91 98765 43210"
      />

      <AuthField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Create password"
        minLength={8}
        required
      />

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
        {isSubmitting ? "Creating Account" : "Create Account"}
      </button>
    </form>
  );
}
