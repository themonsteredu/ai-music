import 'server-only';
import { PrismaClient } from '@prisma/client';

// 개발 중 hot-reload로 커넥션이 늘어나지 않도록 싱글턴으로 관리.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
