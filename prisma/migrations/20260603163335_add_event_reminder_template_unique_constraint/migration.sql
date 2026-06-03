/*
  Warnings:

  - A unique constraint covering the columns `[eventId,offset]` on the table `event_reminder_templates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "event_reminder_templates_eventId_offset_key" ON "event_reminder_templates"("eventId", "offset");
