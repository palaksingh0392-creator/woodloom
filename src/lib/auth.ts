import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

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

export function verifyPassword(password: string, storedHash: string) {
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

function getAuthSecret() {
  return process.env.AUTH_SECRET || "woodloom-local-development-secret";
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

export const sessionCookieName = "woodloom_session";

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
