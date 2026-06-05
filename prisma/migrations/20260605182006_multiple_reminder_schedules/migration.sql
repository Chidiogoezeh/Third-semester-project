/*
  Warnings:

  - You are about to drop the column `reminderWindow` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "reminderWindow",
ADD COLUMN     "creatorReminderOffsets" INTEGER[] DEFAULT ARRAY[24]::INTEGER[];
