// ✅ ESM-safe import for Vercel/Nitro
import { PrismaPg } from '@prisma/adapter-pg';
import * as prismaModule from '@prisma/client';

// Extract PrismaClient from the namespace
const PrismaClient = prismaModule.PrismaClient;

const globalForPrisma = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  // 🚨 Prisma Driver Adapter
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
