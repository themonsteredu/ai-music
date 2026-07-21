-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "updatedAt" DATETIME NOT NULL
);
