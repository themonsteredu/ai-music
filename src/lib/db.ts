import 'server-only';
import { isServerless } from '@/lib/env';

// 서버리스(Vercel)에서는 파일시스템이 읽기 전용이라, 쓰기가 가능한 /tmp 로 DB 를 둔다.
// (데모용 임시 저장 — 인스턴스가 재시작되면 초기화됨. 영구 저장은 Supabase 등으로 업그레이드)
if (isServerless && !process.env.DATABASE_URL?.includes('/tmp')) {
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}

import { PrismaClient } from '@prisma/client';

// 개발 중 hot-reload로 커넥션이 늘어나지 않도록 싱글턴으로 관리.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  dbReady?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * 서버리스 /tmp DB 에는 마이그레이션이 적용돼 있지 않으므로,
 * 최초 요청 시 테이블을 idempotent 하게 만든다. (로컬은 이미 존재 → no-op)
 * 라우트 핸들러에서 DB 접근 전에 `await dbReady` 한다.
 */
async function ensureSchema(): Promise<void> {
  if (!isServerless) return; // 로컬은 prisma migrate 로 이미 생성됨
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Track" (
      "id" TEXT PRIMARY KEY,
      "studentName" TEXT,
      "classCode" TEXT,
      "title" TEXT,
      "kind" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "mode" TEXT NOT NULL,
      "providerJobId" TEXT,
      "status" TEXT NOT NULL,
      "storeName" TEXT,
      "category" TEXT,
      "vibe" TEXT,
      "prompt" TEXT NOT NULL,
      "lyrics" TEXT,
      "durationSec" INTEGER,
      "fileUrl" TEXT,
      "mimeType" TEXT,
      "error" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UsageEvent" (
      "id" TEXT PRIMARY KEY,
      "day" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "seconds" INTEGER NOT NULL,
      "costUsd" REAL NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export const dbReady: Promise<void> =
  globalForPrisma.dbReady ??
  ensureSchema().catch((e) => {
    console.error('ensureSchema failed', e);
  });
globalForPrisma.dbReady = dbReady;
