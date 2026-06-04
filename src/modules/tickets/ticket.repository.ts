import { prisma } from "../../config/database";

export class TicketRepository {
  async findByToken(
    ticketToken: string) {
    return prisma.ticket.findUnique({
      where: {
        ticketToken
      },
      include: {
        event: {
          select: {
            creatorId: true
          }
        }
      }
    });
  }

  async scanTicket(ticketToken: string) {
    const result =
      await prisma.ticket.updateMany({
        where: {
          ticketToken,
          isScanned: false
        },
        data: {
          isScanned: true,
          scannedAt: new Date()
        }
      });

    return result.count;
  }
}