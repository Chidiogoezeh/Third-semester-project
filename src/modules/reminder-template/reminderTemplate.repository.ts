import { prisma } from "../../config/database";

export class ReminderTemplateRepository {
  create(data: {
    eventId: string;
    creatorId: string;
    reminderOffset: number;
  }) {
    return prisma.eventReminderTemplate.create({
      data: {
        eventId: data.eventId,
        offset: data.reminderOffset
      }
    });
  }

  findByEvent(eventId: string) {
    return prisma.eventReminderTemplate.findMany({
      where: {
        eventId
      },
      orderBy: {
        offset: "asc"
      }
    });
  }

  delete(templateId: string) {
    return prisma.eventReminderTemplate.delete({
      where: {
        id: templateId
      }
    });
  }
}