import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Global Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let isDbConnected = false;

/**
 * Test database connectivity
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn("⚠️ PostgreSQL database connection not ready:", (error as Error).message);
    return false;
  }
}

export function getDatabaseStatus(): { connected: boolean; url: string } {
  // Mask password in database URL for safe display
  const maskedUrl = env.DATABASE_URL.replace(/:([^@:]+)@/, ":****@");
  return {
    connected: isDbConnected,
    url: maskedUrl,
  };
}
