"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        source: "footer",
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);
    setMessage(data.message ?? "You are subscribed to WOODLOOM updates.");

    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form onSubmit={subscribe}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          required
          name="email"
          type="email"
          placeholder="Enter your email"
          className="
            h-14
            flex-1
            rounded-full
            border
            border-white/10
            bg-white/5
            px-5
            text-white
            outline-none
            placeholder:text-white/40
            transition-all
            focus:border-[#c8a27a]
          "
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            flex
            h-14
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#c8a27a]
            px-8
            text-sm
            font-medium
            uppercase
            tracking-[2px]
            text-black
            transition-all
            hover:bg-[#d5b08a]
            disabled:opacity-60
          "
        >
          {isSubmitting ? "Subscribing" : "Subscribe"}
          <ArrowRight size={16} />
        </button>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {message}
        </p>
      ) : null}
    </form>
  );
}
