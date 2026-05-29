import { prisma } from "../../config/database";

export class TicketRepository {
  async create(data: any) {
    return prisma.ticket.create({
      data
    });
  }

  async findByToken(ticketToken: string) {
    return prisma.ticket.findUnique({
      where: {
        ticketToken
      }
    });
  }

  async markAsScanned(id: string) {
    return prisma.ticket.update({
      where: {
        id
      },
      data: {
        isScanned: true,
        scannedAt: new Date()
      }
    });
  }
}