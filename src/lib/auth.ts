import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

import { normalizeEmail, normalizePhone } from "@/lib/account-validation";

export const userRoles = ["CUSTOMER", "ADMIN", "STAFF"] as const;

export type UserRole = (typeof userRoles)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export function canAccessAdmin(role: UserRole) {
  return role === "ADMIN" || role === "STAFF";
}

export function isCustomer(role: UserRole) {
  return role === "CUSTOMER";
}

const passwordIterations = 120000;
const passwordKeyLength = 64;
const passwordDigest = "sha512";

export function hasDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  return Boolean(databaseUrl && !databaseUrl.includes("YOUR_PASSWORD"));
}

export function getLoginLookupCandidates(input: {
  identifier?: unknown;
  email?: unknown;
  phone?: unknown;
}) {
  const identifier = typeof input.identifier === "string" ? input.identifier.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";

  const preferred = identifier || email || phone;

  if (!preferred) {
    return [] as string[];
  }

  const candidates = new Set<string>();

  if (preferred.includes("@")) {
    const normalized = normalizeEmail(preferred);
    if (normalized) candidates.add(normalized);
    return Array.from(candidates);
  }

  const normalizedPhone = normalizePhone(preferred);
  if (normalizedPhone) {
    candidates.add(normalizedPhone);
  }

  const rawDigits = preferred.replace(/\D/g, "");
  if (rawDigits.length === 10) {
    candidates.add(rawDigits);
    candidates.add(`91${rawDigits}`);
    candidates.add(`+91${rawDigits}`);
  }

  if (preferred.startsWith("+91") && preferred.replace(/\D/g, "").length === 12) {
    candidates.add(preferred.replace(/\D/g, ""));
  }

  const cleaned = preferred.replace(/\s+/g, "").replace(/\+91/, "");
  if (/^\d{10}$/.test(cleaned)) {
    candidates.add(cleaned);
    candidates.add(`+91${cleaned}`);
  }

  return Array.from(candidates);
}

export function resolveLoginIdentifier(input: {
  identifier?: unknown;
  email?: unknown;
  phone?: unknown;
}) {
  const candidates = getLoginLookupCandidates(input);

  if (!candidates.length) {
    return { email: "", phone: "" };
  }

  const emailCandidate = candidates.find((value) => value.includes("@"));
  const phoneCandidate = candidates.find((value) => !value.includes("@"));

  return {
    email: emailCandidate ? normalizeEmail(emailCandidate) : "",
    phone: phoneCandidate ? normalizePhone(phoneCandidate) || phoneCandidate : "",
  };
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    password,
    salt,
    passwordIterations,
    passwordKeyLength,
    passwordDigest,
  ).toString("hex");

  return `${passwordIterations}:${salt}:${hash}`;
}

export function hasCompatiblePasswordHash(storedHash: string) {
  const [iterations, salt, hash] = storedHash.split(":");
  const iterationCount = Number(iterations);

  return Boolean(
    Number.isInteger(iterationCount) &&
      iterationCount > 0 &&
      salt &&
      /^[a-f0-9]+$/i.test(salt) &&
      hash &&
      /^[a-f0-9]+$/i.test(hash),
  );
}

export function verifyPassword(password: string, storedHash: string) {
  if (!hasCompatiblePasswordHash(storedHash)) {
    return false;
  }

  const [iterations, salt, hash] = storedHash.split(":");

  if (!iterations || !salt || !hash) {
    return false;
  }

  const candidate = pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    passwordKeyLength,
    passwordDigest,
  );
  const stored = Buffer.from(hash, "hex");

  return (
    candidate.length === stored.length && timingSafeEqual(candidate, stored)
  );
}

export function getAuthSecret() {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be configured in production.");
  }

  return "shissoo-local-development-secret";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createSignedToken<T extends object>(payload: T) {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySignedToken<T extends object>(token?: string) {
  if (!token) return null;

  const [payload, signature] = token.split(".");

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as T;
  } catch {
    return null;
  }
}

export const sessionCookieName = "shissoo_session";

export type SessionPayload = AuthUser & {
  expiresAt: number;
};

export function createSessionToken(user: AuthUser) {
  return createSignedToken({
      ...user,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    } satisfies SessionPayload);
}

export function verifySessionToken(token?: string) {
  const session = verifySignedToken<SessionPayload>(token);

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session;
}
