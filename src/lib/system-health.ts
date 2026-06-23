import "server-only";

import { isCloudinaryConfigured, getUploadMode } from "@/lib/cloudinary";
import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type HealthCheck = {
  key: string;
  label: string;
  status: "ok" | "warning" | "error";
  message: string;
};

function hasValue(key: string) {
  const value = process.env[key];

  return Boolean(value && value.trim() && !value.includes("YOUR_PASSWORD"));
}

async function checkDatabase(): Promise<HealthCheck> {
  if (!hasDatabaseUrl()) {
    return {
      key: "database",
      label: "Database",
      status: "error",
      message: "DATABASE_URL is missing or still uses placeholder values.",
    };
  }

  try {
    await prisma.user.count();

    return {
      key: "database",
      label: "Database",
      status: "ok",
      message: "SQL Server connection is working.",
    };
  } catch (error) {
    return {
      key: "database",
      label: "Database",
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Database connection failed.",
    };
  }
}

function checkAuthSecret(): HealthCheck {
  const configured = hasValue("AUTH_SECRET");

  return {
    key: "auth-secret",
    label: "Auth Secret",
    status: configured
      ? "ok"
      : process.env.NODE_ENV === "production"
        ? "error"
        : "warning",
    message: configured
      ? "AUTH_SECRET is configured."
      : "Development fallback is active. Configure AUTH_SECRET before production.",
  };
}

function checkCloudinary(): HealthCheck {
  const configured = isCloudinaryConfigured();
  const uploadMode = getUploadMode();

  return {
    key: "cloudinary",
    label: "Cloudinary",
    status: configured ? "ok" : uploadMode === "local" ? "warning" : "error",
    message: configured
      ? "Cloudinary image uploads are configured."
      : uploadMode === "local"
        ? "Local image uploads are enabled for development."
        : "Cloudinary keys are missing for this environment.",
  };
}

function checkEmail(): HealthCheck {
  const smtpReady =
    process.env.EMAIL_DELIVERY_MODE === "smtp" &&
    hasValue("SMTP_HOST") &&
    hasValue("SMTP_USER") &&
    hasValue("SMTP_PASS") &&
    hasValue("SMTP_FROM");

  return {
    key: "email",
    label: "Email",
    status: smtpReady ? "ok" : "warning",
    message: smtpReady
      ? "SMTP email delivery is configured."
      : "Email is using console/local delivery mode.",
  };
}

function checkAppUrl(): HealthCheck {
  const configured = hasValue("NEXT_PUBLIC_APP_URL");

  return {
    key: "app-url",
    label: "App URL",
    status: configured ? "ok" : "warning",
    message: configured
      ? "NEXT_PUBLIC_APP_URL is configured."
      : "NEXT_PUBLIC_APP_URL is missing.",
  };
}

export async function getSystemHealth() {
  const checks = [
    await checkDatabase(),
    checkAuthSecret(),
    checkCloudinary(),
    checkEmail(),
    checkAppUrl(),
  ];
  const hasError = checks.some((check) => check.status === "error");
  const hasWarning = checks.some((check) => check.status === "warning");

  return {
    status: hasError ? "error" : hasWarning ? "warning" : "ok",
    checkedAt: new Date().toISOString(),
    environment: process.env.VERCEL === "1" ? "vercel" : "local",
    checks,
  };
}
