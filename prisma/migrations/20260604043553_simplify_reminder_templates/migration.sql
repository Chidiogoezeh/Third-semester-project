/*
  Warnings:

  - You are about to drop the `event_reminder_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_reminder_templates" DROP CONSTRAINT "event_reminder_templates_eventId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "reminderTemplates" JSONB;

-- DropTable
DROP TABLE "event_reminder_templates";
