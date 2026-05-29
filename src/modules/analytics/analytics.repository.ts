import { prisma } from "../../config/database";

export class AnalyticsRepository {
  async getCreatorEvents(
    creatorId: string
  ) {
    return prisma.event.findMany({
      where: {
        creatorId
      },
      include: {
        tickets: true
      }
    });
  }
}