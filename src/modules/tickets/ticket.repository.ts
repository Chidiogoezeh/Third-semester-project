import { prisma } from "../../config/database";

import {
  Prisma
} from "@prisma/client";

export class TicketRepository {
  async create(
    data: Prisma.TicketCreateInput
  ) {
    return prisma.ticket.create({
      data
    });
  }

  async findByToken(
    ticketToken: string
  ) {
    return prisma.ticket.findUnique({
      where: {
        ticketToken
      }
    });
  }

  async markAsScanned(
    id: string
  ) {
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