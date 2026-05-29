import { prisma } from "../../config/database";

export class ReminderRepository {
  async create(data: any) {
    return prisma.reminder.create({
      data
    });
  }
}