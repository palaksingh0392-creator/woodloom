import "server-only";

import { createHash, randomInt } from "crypto";

import {
  createSignedToken,
  getAuthSecret,
  verifySignedToken,
} from "@/lib/auth";
import { sendAuthEmail } from "@/lib/email";

type OtpPurpose = "login" | "password-reset";

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
      ? "Your WOODLOOM login OTP"
      : "Your WOODLOOM password reset OTP";

  await sendAuthEmail({
    to: input.email,
    subject,
    text: `Your WOODLOOM OTP is ${otp}. It expires in 10 minutes.`,
  });

  return {
    challenge,
    expiresAt,
    devOtp: process.env.EMAIL_DELIVERY_MODE === "smtp" ? undefined : otp,
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
