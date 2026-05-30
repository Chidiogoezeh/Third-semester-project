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

  async getSuccessfulRevenue(
    creatorId: string
  ) {
    const result =
      await prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: "SUCCESS",
          ticket: {
            event: {
              creatorId
            }
          }
        }
      });

    return result._sum.amount ?? 0;
  }
}