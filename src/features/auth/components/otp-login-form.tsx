"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AuthField from "./auth-field";

export default function OtpLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState("");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestOtp() {
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "login" }),
    });
    const data = (await response.json()) as {
      message?: string;
      challenge?: string;
      devOtp?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !data.challenge) {
      setMessage(data.message ?? "Unable to send OTP.");
      return;
    }

    setChallenge(data.challenge);
    setDevOtp(data.devOtp ?? "");
    setMessage("OTP sent. Check your email or use the local development code below.");
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, challenge, purpose: "login" }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to verify OTP.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={verifyOtp}>
      <AuthField
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <button
        type="button"
        disabled={isSubmitting || !email}
        onClick={requestOtp}
        className="h-14 rounded-full border border-[var(--border)] px-8 text-sm uppercase tracking-[2px] disabled:opacity-60"
      >
        {challenge ? "Send New OTP" : "Send OTP"}
      </button>

      {challenge ? (
        <AuthField
          id="otp"
          label="OTP code"
          type="text"
          inputMode="numeric"
          placeholder="6 digit code"
          maxLength={6}
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          required
        />
      ) : null}

      {devOtp ? (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm">
          Local development OTP: <strong>{devOtp}</strong>
        </p>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !challenge || otp.length < 6}
        className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:opacity-60"
      >
        {isSubmitting ? "Verifying" : "Verify OTP"}
      </button>
    </form>
  );
}
