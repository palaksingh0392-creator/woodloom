"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthField from "./auth-field";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function requestOtp() {
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "password-reset" }),
    });
    const data = (await response.json()) as {
      message?: string;
      challenge?: string;
      devOtp?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !data.challenge) {
      setMessage(data.message ?? "Unable to send reset OTP.");
      return;
    }

    setChallenge(data.challenge);
    setDevOtp(data.devOtp ?? "");
    setMessage("Reset OTP sent. Check your email or use the local development code below.");
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        challenge,
        purpose: "password-reset",
        newPassword,
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to reset password.");
      return;
    }

    setIsComplete(true);
    setMessage("Password updated successfully.");
  }

  if (isComplete) {
    return (
      <div className="grid gap-5">
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm">
          Password updated successfully. You can now log in with the new password.
        </p>
        <Link
          href="/login"
          className="flex h-14 items-center justify-center rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white"
        >
          Back To Login
        </Link>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={resetPassword}>
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
        {challenge ? "Send New OTP" : "Send Reset OTP"}
      </button>

      {challenge ? (
        <>
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
          <AuthField
            id="newPassword"
            label="New password"
            type="password"
            placeholder="Create new password"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </>
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
        disabled={isSubmitting || !challenge || otp.length < 6 || newPassword.length < 8}
        className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:opacity-60"
      >
        {isSubmitting ? "Updating" : "Update Password"}
      </button>
    </form>
  );
}
