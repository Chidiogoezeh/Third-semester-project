import { prisma } from "../../config/database";
import { scheduleReminder } from "./reminder.worker";
import { AppError } from "../../shared/errors/appError";

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
      throw AppError.notFound(
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
      throw AppError.notFound(
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