import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl =
  process.env.DATABASE_URL ??
  "sqlserver://localhost:1433;database=woodloom;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true";

const sanitizedDatabaseUrl = /(?:^|;)connect(?:ion)?Timeout=/i.test(databaseUrl)
  ? databaseUrl
  : `${databaseUrl};connectTimeout=30000;`;

const adapter = new PrismaMssql(sanitizedDatabaseUrl);
let databaseUnavailableUntil = 0;

export function withDatabaseTimeout<T>(
  label: string,
  query: () => Promise<T>,
  timeoutMs = 10000,
) {
  if (Date.now() < databaseUnavailableUntil) {
    return Promise.reject(new Error("Database temporarily unavailable."));
  }

  return Promise.race([
    query(),
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${label} timed out after ${timeoutMs} milliseconds.`));
      }, timeoutMs);
    }),
  ]).catch((error) => {
    if (error instanceof Error && error.message.includes("timed out after")) {
      databaseUnavailableUntil = Date.now() + 15000;
    }

    throw error;
  });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
