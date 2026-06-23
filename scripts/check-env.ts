import "dotenv/config";

type Check = {
  key: string;
  requiredFor: "local" | "production" | "optional";
  isConfigured: boolean;
  note: string;
};

function hasValue(key: string) {
  const value = process.env[key];

  return Boolean(value && value.trim() && !value.includes("YOUR_PASSWORD"));
}

const checks: Check[] = [
  {
    key: "DATABASE_URL",
    requiredFor: "local",
    isConfigured: hasValue("DATABASE_URL"),
    note: "Required for SQL Server-backed auth, checkout, admin, reviews, messages, and catalog.",
  },
  {
    key: "AUTH_SECRET",
    requiredFor: "production",
    isConfigured: hasValue("AUTH_SECRET"),
    note: "Set a long random string before production login is trusted.",
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    requiredFor: "production",
    isConfigured: hasValue("NEXT_PUBLIC_APP_URL"),
    note: "Use the live Vercel URL in production.",
  },
  {
    key: "CLOUDINARY_CLOUD_NAME",
    requiredFor: "production",
    isConfigured: hasValue("CLOUDINARY_CLOUD_NAME"),
    note: "Required for production image uploads.",
  },
  {
    key: "CLOUDINARY_API_KEY",
    requiredFor: "production",
    isConfigured: hasValue("CLOUDINARY_API_KEY"),
    note: "Required for production image uploads.",
  },
  {
    key: "CLOUDINARY_API_SECRET",
    requiredFor: "production",
    isConfigured: hasValue("CLOUDINARY_API_SECRET"),
    note: "Required for production image uploads.",
  },
  {
    key: "EMAIL_DELIVERY_MODE",
    requiredFor: "production",
    isConfigured:
      process.env.EMAIL_DELIVERY_MODE === "smtp" &&
      hasValue("SMTP_HOST") &&
      hasValue("SMTP_USER") &&
      hasValue("SMTP_PASS") &&
      hasValue("SMTP_FROM"),
    note: "Use smtp with SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM for production.",
  },
  {
    key: "RAZORPAY_KEY_ID",
    requiredFor: "optional",
    isConfigured: hasValue("RAZORPAY_KEY_ID"),
    note: "Only required when Razorpay is enabled.",
  },
  {
    key: "RAZORPAY_KEY_SECRET",
    requiredFor: "optional",
    isConfigured: hasValue("RAZORPAY_KEY_SECRET"),
    note: "Only required when Razorpay is enabled.",
  },
  {
    key: "NEXT_PUBLIC_RAZORPAY_KEY_ID",
    requiredFor: "optional",
    isConfigured: hasValue("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
    note: "Only required when Razorpay is enabled.",
  },
];

console.log("WOODLOOM environment check");
console.log("==========================");

for (const check of checks) {
  const status = check.isConfigured ? "OK" : "MISSING";
  console.log(`${status.padEnd(8)} ${check.key.padEnd(28)} ${check.note}`);
}

const missingProduction = checks.filter(
  (check) => check.requiredFor === "production" && !check.isConfigured,
);

if (missingProduction.length > 0) {
  console.log("");
  console.log(
    `Production is not fully ready. Missing: ${missingProduction
      .map((check) => check.key)
      .join(", ")}`,
  );
  process.exitCode = 1;
}
