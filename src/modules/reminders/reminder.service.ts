import { prisma } from "../../config/database";
import { ReminderRepository } from "./reminder.repository";
import { scheduleReminder } from "./reminder.scheduler";
import { NotFoundError } from "../../shared/errors/notFound";

const repository =
  new ReminderRepository();

export class ReminderService {
  async createReminder(data: {
    eventId: string;
    userId: string;
    reminderOffset: number;
  }) {
    const reminder =
      await repository.create(data);

    const event =
      await prisma.event.create({
        data: {
          title,
          eventDate,
          reminderTemplates:
            reminderTemplates ?? [24]
        }
      });

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: data.userId
        }
      });

    if (!user) {
      throw new NotFoundError(
        "User not found"
      );
    }

    await scheduleReminder({
      reminderId: reminder.id,

      email: user.email,

      eventTitle: event.title,

      eventDate: event.eventDate,

      location: event.location,

      reminderOffset:
        reminder.reminderOffset
    });

    return reminder;
  }
}