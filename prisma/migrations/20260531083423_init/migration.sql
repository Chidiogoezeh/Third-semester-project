/*
  Warnings:

  - You are about to drop the column `ticketId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,eventeeId]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventeeId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'ABANDONED';
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_ticketId_fkey";

-- DropIndex
DROP INDEX "payments_ticketId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "ticketId",
ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "eventeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "paymentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "events_creatorId_idx" ON "events"("creatorId");

-- CreateIndex
CREATE INDEX "payments_eventId_idx" ON "payments"("eventId");

-- CreateIndex
CREATE INDEX "payments_eventeeId_idx" ON "payments"("eventeeId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "reminders_eventId_idx" ON "reminders"("eventId");

-- CreateIndex
CREATE INDEX "reminders_userId_idx" ON "reminders"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_paymentId_key" ON "tickets"("paymentId");

-- CreateIndex
CREATE INDEX "tickets_eventId_idx" ON "tickets"("eventId");

-- CreateIndex
CREATE INDEX "tickets_eventeeId_idx" ON "tickets"("eventeeId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_eventId_eventeeId_key" ON "tickets"("eventId", "eventeeId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_eventeeId_fkey" FOREIGN KEY ("eventeeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
