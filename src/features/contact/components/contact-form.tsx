"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

const fieldClass =
  "h-12 rounded-full border border-[var(--border)] bg-transparent px-4 outline-none focus:border-[var(--primary)]";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);
    setMessage(data.message ?? "Thanks. Our team will get back to you soon.");

    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form
      onSubmit={submitContact}
      className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <h2 className="mb-5 text-3xl">Send A Message</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Full name"
          className={fieldClass}
        />
        <input
          required
          name="email"
          type="email"
          placeholder="Email address"
          className={fieldClass}
        />
        <input name="phone" placeholder="Phone, optional" className={fieldClass} />
        <input
          required
          name="subject"
          placeholder="Subject"
          className={fieldClass}
        />
        <textarea
          required
          name="message"
          rows={5}
          placeholder="How can we help?"
          className="rounded-[18px] border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)] md:col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold uppercase tracking-[2px] text-white disabled:opacity-60"
      >
        <Send size={16} />
        {isSubmitting ? "Sending" : "Send Message"}
      </button>

      {message ? (
        <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          {message}
        </p>
      ) : null}
    </form>
  );
}
