import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient({
  // log: ["query", "info", "warn", "error"], 
  log: ["warn", "error"], 
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
