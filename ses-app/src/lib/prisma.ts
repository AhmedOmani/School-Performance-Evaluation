import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined; };

console.log("Prisma Client Initializing...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL defined:", !!process.env.DATABASE_URL);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;