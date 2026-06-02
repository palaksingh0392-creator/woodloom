"use client";

import { FormEvent, useState } from "react";

import type { AccountProfile } from "@/lib/account";
import AuthField from "@/features/auth/components/auth-field";

export default function ProfileForm({
  profile,
}: {
  profile: AccountProfile;
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);
    setMessage(
      response.ok
        ? "Profile saved successfully."
        : data.message ?? "Unable to save profile.",
    );
  }

  return (
    <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
      <AuthField
        id="name"
        name="name"
        label="Full name"
        defaultValue={profile.name}
        placeholder="Your name"
        required
      />
      <AuthField
        id="email"
        name="email"
        label="Email address"
        type="email"
        defaultValue={profile.email}
        readOnly
      />
      <AuthField
        id="phone"
        name="phone"
        label="Phone number"
        type="tel"
        defaultValue={profile.phone}
        placeholder="+91 98765 43210"
      />
      <AuthField
        id="role"
        label="Account role"
        defaultValue={profile.role}
        readOnly
      />

      {message && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)] md:col-span-2">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 md:w-fit"
      >
        {isSubmitting ? "Saving" : "Save Profile"}
      </button>
    </form>
  );
}
