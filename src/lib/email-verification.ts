import "server-only";

import { createSignedToken, verifySignedToken } from "@/lib/auth";
import { normalizeEmail } from "@/lib/account-validation";
import { sendAuthEmail } from "@/lib/email";

type VerificationPayload = {
  email: string;
  purpose: "signup";
  expiresAt: number;
};

export async function createEmailVerificationLink(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const token = createSignedToken<VerificationPayload>({
    email: normalizedEmail,
    purpose: "signup",
    expiresAt,
  });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const delivery = await sendAuthEmail({
    to: normalizedEmail,
    subject: "Verify your Shissoo email address",
    text: `Verify your Shissoo email address by opening this link:\n\n${verificationUrl}\n\nThis link expires in 10 minutes.`,
  });

  return { token, verificationUrl, expiresAt, delivered: delivery.delivered };
}

export function verifyEmailVerificationToken(token: string, email: string) {
  const payload = verifySignedToken<VerificationPayload>(token);

  return Boolean(
    payload &&
      payload.purpose === "signup" &&
      payload.email === normalizeEmail(email) &&
      payload.expiresAt >= Date.now(),
  );
}
