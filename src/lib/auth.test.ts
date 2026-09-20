import test from "node:test";
import assert from "node:assert/strict";

import { formatPhoneInput } from "@/lib/account-validation";
import { getLoginLookupCandidates, resolveLoginIdentifier } from "@/lib/auth";
import { sendAuthEmail } from "@/lib/email";

test("login accepts either identifier or email and trims values", () => {
  assert.deepEqual(resolveLoginIdentifier({ identifier: " user@example.com " }), {
    email: "user@example.com",
    phone: "",
  });
  assert.deepEqual(resolveLoginIdentifier({ email: " user@example.com " }), {
    email: "user@example.com",
    phone: "",
  });
  assert.deepEqual(resolveLoginIdentifier({ identifier: " +91 98765 43210 " }), {
    email: "",
    phone: "+919876543210",
  });
});

test("phone input auto-adds the +91 prefix and keeps it valid", () => {
  assert.equal(formatPhoneInput("9876543210"), "+91 98765 43210");
  assert.equal(formatPhoneInput("919876543210"), "+91 98765 43210");
  assert.equal(formatPhoneInput("+91 9876543210"), "+91 98765 43210");
  assert.equal(resolveLoginIdentifier({ identifier: "+91 98765 43210" }).phone, "+919876543210");
});

test("phone login lookup matches both +91 and raw 10-digit formats", () => {
  assert.deepEqual(
    [...getLoginLookupCandidates({ identifier: "+91 98765 43210" })].sort(),
    ["+919876543210", "919876543210", "9876543210"].sort(),
  );

  assert.deepEqual(
    [...getLoginLookupCandidates({ identifier: "9876543210" })].sort(),
    ["+919876543210", "919876543210", "9876543210"].sort(),
  );
});

test("smtp placeholder credentials are rejected", async () => {
  const previous = { ...process.env };

  process.env.EMAIL_DELIVERY_MODE = "smtp";
  process.env.SMTP_HOST = "smtp.gmail.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "palak.singh0392@gmail.com";
  process.env.SMTP_PASS = "your-16-char-app-password";
  process.env.SMTP_FROM = "palak.singh0392@gmail.com";

  try {
    await assert.rejects(
      sendAuthEmail({
        to: "user@example.com",
        subject: "Test OTP",
        text: "123456",
      }),
      /real SMTP credentials/,
    );
  } finally {
    process.env = previous;
  }
});
