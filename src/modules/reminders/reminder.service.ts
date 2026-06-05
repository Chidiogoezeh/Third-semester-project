import { prisma } from "../../config/database";
import { scheduleReminder } from "./reminder.worker";
import { AppError } from "../../shared/errors/appError";

export class ReminderService {
  async createReminder(data: {
    eventId: string;
    userId: string;
    reminderOffset: number;
  }) {
    const [event, user] =
      await Promise.all([
        prisma.event.findUnique({
          where: { id: data.eventId }
        }),
        prisma.user.findUnique({
          where: { id: data.userId }
        })
      ]);

    if (!event) {
      throw AppError.notFound(
        "Event not found"
      );
    }

    if (!user) {
      throw AppError.notFound(
        "User not found"
      );
    }

    const reminder =
      await prisma.reminder.upsert({
        where: {
          eventId_userId_reminderOffset: {
            eventId: data.eventId,
            userId: data.userId,
            reminderOffset: data.reminderOffset
          }
        },
        update: {},
        create: data
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

    return reminder;
  }
}