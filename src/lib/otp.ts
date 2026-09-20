import "server-only";

import { createHash, randomInt } from "crypto";

import {
  createSignedToken,
  getAuthSecret,
  verifySignedToken,
} from "@/lib/auth";
import { sendAuthEmail } from "@/lib/email";

type OtpPurpose = "login" | "password-reset" | "signup";

type OtpPayload = {
  email: string;
  purpose: OtpPurpose;
  otpHash: string;
  expiresAt: number;
};

function hashOtp(email: string, otp: string, purpose: OtpPurpose) {
  return createHash("sha256")
    .update(`${email}:${otp}:${purpose}:${getAuthSecret()}`)
    .digest("hex");
}

function createOtp() {
  return String(randomInt(100000, 1000000));
}

export async function createOtpChallenge(input: {
  email: string;
  purpose: OtpPurpose;
}) {
  const otp = createOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const challenge = createSignedToken<OtpPayload>({
    email: input.email,
    purpose: input.purpose,
    otpHash: hashOtp(input.email, otp, input.purpose),
    expiresAt,
  });
  const subject =
    input.purpose === "login"
      ? "Your Shissoo login OTP"
      : input.purpose === "password-reset"
        ? "Your Shissoo password reset OTP"
        : "Verify your Shissoo email";

  const delivery = await sendAuthEmail({
    to: input.email,
    subject,
    text:
      input.purpose === "signup"
        ? `Your Shissoo email verification code is ${otp}. It expires in 10 minutes.`
        : `Your Shissoo OTP is ${otp}. It expires in 10 minutes.`,
  });

  if (process.env.NODE_ENV === "production" && !delivery.delivered) {
    throw new Error("Email delivery is not configured for verification codes.");
  }

  const shouldExposeDevOtp =
    process.env.NODE_ENV !== "production" &&
    process.env.EMAIL_DELIVERY_MODE === "local";

  return {
    challenge,
    expiresAt,
    delivered: delivery.delivered,
    devOtp: shouldExposeDevOtp ? otp : undefined,
  };
}

export function verifyOtpChallenge(input: {
  challenge?: string;
  email: string;
  otp: string;
  purpose: OtpPurpose;
}) {
  const payload = verifySignedToken<OtpPayload>(input.challenge);

  if (
    !payload ||
    payload.email !== input.email ||
    payload.purpose !== input.purpose ||
    payload.expiresAt < Date.now()
  ) {
    return false;
  }

  return payload.otpHash === hashOtp(input.email, input.otp, input.purpose);
}
