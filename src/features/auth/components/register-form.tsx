"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  formatIndianPhone,
  formatPhoneInput,
  isStrongPassword,
  isValidEmail,
  isValidPhone,
} from "@/lib/account-validation";

import AuthField from "./auth-field";

export default function RegisterForm({
  verifiedEmail,
  verificationToken,
}: {
  verifiedEmail?: string;
  verificationToken?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(verifiedEmail ?? "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLinkVerified, setEmailLinkVerified] = useState(Boolean(verificationToken));
  const emailIsValid = email.trim().length > 0 && isValidEmail(email);
  const phoneIsValid = !phone || isValidPhone(phone);
  const passwordIsStrong = isStrongPassword(password);

  async function requestEmailCode() {
    if (!email.trim() || !isValidEmail(email)) {
      setMessage("Enter a valid email address first.");
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setMessage("Enter a valid Indian mobile number with +91 and 10 digits.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/email-verification/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        challenge?: string;
        devOtp?: string;
      };

      if (!response.ok) {
        setMessage(data.message ?? "Unable to send your verification code.");
        setIsSubmitting(false);
        return;
      }

      setChallenge(data.challenge ?? "");
      setEmailSent(true);
      setMessage(
        data.devOtp
          ? `Your local verification code is ${data.devOtp}.`
          : "Verification code sent. Check your email.",
      );
    } catch {
      setMessage("Verification email could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const normalizedPhone = phone ? formatIndianPhone(phone) : "";

      if (normalizedPhone === "" && phone) {
        setMessage("Enter a valid Indian mobile number with +91 and 10 digits.");
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: normalizedPhone || formData.get("phone"),
          password: formData.get("password"),
          challenge,
          verificationCode,
          verificationToken: emailLinkVerified ? verificationToken : undefined,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setMessage(
          data.message ??
            "Registration server is not working right now. Please try again shortly.",
        );
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setMessage(
        "Registration server is not reachable. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="grid gap-2">
        <AuthField
          id="email"
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setChallenge("");
            setVerificationCode("");
            setEmailSent(false);
            setEmailLinkVerified(false);
          }}
          required
        />
        {email.trim() && (
          <p className={`text-xs ${emailIsValid ? "text-emerald-600" : "text-[var(--danger)]"}`}>
            {emailIsValid ? "Valid email address." : "Enter a valid email address."}
          </p>
        )}
        <button
          type="button"
          onClick={requestEmailCode}
          disabled={isSubmitting || !email.trim()}
          className="h-12 rounded-full border border-[var(--border)] px-5 text-xs uppercase tracking-[2px] disabled:opacity-60"
        >
          {emailLinkVerified ? "Email verified" : emailSent ? "Send New Code" : "Send Verification Code"}
        </button>
      </div>

      {challenge && !emailLinkVerified ? (
        <AuthField
          id="verificationCode"
          name="verificationCode"
          label="Email verification code"
          type="text"
          inputMode="numeric"
          placeholder="6 digit code"
          maxLength={6}
          value={verificationCode}
          onChange={(event) => setVerificationCode(event.target.value)}
          required
        />
      ) : null}

      <div className="grid gap-2">
        <AuthField
          id="phone"
          name="phone"
          label="Phone number"
          type="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(event) => {
            const next = formatPhoneInput(event.target.value);
            setPhone(next || event.target.value.replace(/[^\d+]/g, ""));
          }}
        />
        {phone && (
          <p className={`text-xs ${phoneIsValid ? "text-emerald-600" : "text-[var(--danger)]"}`}>
            {phoneIsValid
              ? "Valid Indian mobile number."
              : "Use +91 followed by 10 digits only."}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <AuthField
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Create password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {password && (
          <p className={`text-xs ${passwordIsStrong ? "text-emerald-600" : "text-[var(--danger)]"}`}>
            {passwordIsStrong
              ? "Strong password."
              : "Use 8+ characters with uppercase, lowercase, and a number."}
          </p>
        )}
      </div>

      {message && (
        <p className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          (!emailLinkVerified && (!challenge || verificationCode.length < 6)) ||
          !emailIsValid ||
          !phoneIsValid ||
          !passwordIsStrong
        }
        className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Account" : "Create Account"}
      </button>
    </form>
  );
}
