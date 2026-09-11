import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const isProduction = process.env.NODE_ENV === "production";

function hasUsablePostgresUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    const placeholders = /^(host|user|password|database)$/i;
    return (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      Boolean(url.hostname) &&
      !placeholders.test(url.hostname) &&
      !placeholders.test(url.username) &&
      !placeholders.test(url.pathname.slice(1))
    );
  } catch {
    return false;
  }
}

export const databaseConfigured = hasUsablePostgresUrl(process.env.DATABASE_URL);
export const usingLocalDatabase = !isProduction && !databaseConfigured;

// Production must always use a real database; demo mode is only for local UI work.
export function ensureDatabaseConfigured() {
  if (!databaseConfigured && isProduction) {
    throw new Error("DATABASE_URL is required in production.");
  }
}
