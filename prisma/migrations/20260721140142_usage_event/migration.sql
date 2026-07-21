-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "seconds" INTEGER NOT NULL,
    "costUsd" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "UsageEvent_day_idx" ON "UsageEvent"("day");
