import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js'

type PrismaClientSingleton = {
  prisma: PrismaClient;
};

const globalForPrisma = globalThis as unknown as PrismaClientSingleton & {
  __prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

