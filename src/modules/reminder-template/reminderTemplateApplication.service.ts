import { prisma } from "../../config/database";
import { ReminderRepository } from "../reminders/reminder.repository";
import { scheduleReminder } from "../reminders/reminder.scheduler";

const reminderRepository =
  new ReminderRepository();

export class ReminderTemplateApplicationService {
  async applyTemplates(
    eventId: string,
    eventeeId: string
  ) {
    const templates =
      await prisma.eventReminderTemplate.findMany({
        where: {
          eventId
        }
      });

    if (!templates.length) {
      return;
    }

    const event =
      await prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

    const user =
      await prisma.user.findUnique({
        where: {
          id: eventeeId
        }
      });

    if (!event || !user) {
      return;
    }

    for (const template of templates) {
      const reminder =
        await reminderRepository.create({
          eventId,
          userId: eventeeId,
          reminderOffset:
            template.offset
        });

      await scheduleReminder({
        reminderId: reminder.id,
        email: user.email,
        eventTitle: event.title,
        eventDate: event.eventDate,
        location: event.location,
        reminderOffset:
          reminder.reminderOffset
      });
    }
  }
}