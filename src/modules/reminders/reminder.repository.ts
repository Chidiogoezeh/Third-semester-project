import { prisma } from "../../config/database";

export class ReminderRepository {
  async create(data: any) {
    return prisma.reminder.create({
      data
    });
  }

  async createMany(
    data: {
      eventId: string;
      userId: string;
      reminderOffset: number;
    }[]
  ) {
    return prisma.$transaction(
      data.map(item =>
        prisma.reminder.create({
          data: item
        })
      )
    );
  }
}