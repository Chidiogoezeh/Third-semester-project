import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";
export class TicketRepository {
  async create(
    data: Prisma.TicketUncheckedCreateInput
  ) {
    return prisma.ticket.create({
      data
    });
  }

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