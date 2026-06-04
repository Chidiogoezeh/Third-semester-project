import { prisma } from "../../config/database";
import { scheduleReminder } from "./reminder.worker";
import { NotFoundError } from "../../shared/errors/notFound";

export class ReminderService {
  async createReminder(data: {
    eventId: string;
    userId: string;
    reminderOffset: number;
  }) {
    const reminder =
      await prisma.reminder.create({
        data
      });

    const event =
      await prisma.event.findUnique({
        where: {
          id: data.eventId
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