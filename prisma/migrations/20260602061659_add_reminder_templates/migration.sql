/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId,reminderOffset]` on the table `reminders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "event_reminder_templates" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "offset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_reminder_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_reminder_templates_eventId_idx" ON "event_reminder_templates"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "reminders_eventId_userId_reminderOffset_key" ON "reminders"("eventId", "userId", "reminderOffset");

-- AddForeignKey
ALTER TABLE "event_reminder_templates" ADD CONSTRAINT "event_reminder_templates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
