import { prisma } from "../../config/database";

export class ReminderRepository {
  create(data: {
    eventId: string;
    userId: string;
    reminderOffset: number;
  }) {
    
    return prisma.reminder.create({
      data
    });
  }
}