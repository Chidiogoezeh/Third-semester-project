import { BadRequestError } from "../../shared/errors/badRequest";
import { ConflictError } from "../../shared/errors/conflict";
import { prisma } from "../../config/database";

export class TicketService {
  async verifyTicket(
    ticketToken: string,
    creatorId: string
  ) {
    const ticket =
      await prisma.ticket.findUnique({
        where: {
          ticketToken
        },
        include: {
          event: true
        }
      });

    if (!ticket) {
      throw new BadRequestError(
        "Invalid ticket"
      );
    }

    if (
      ticket.event.creatorId !==
      creatorId
    ) {
      throw new BadRequestError(
        "You are not authorized to verify tickets for this event"
      );
    }

    const result =
      await prisma.ticket.updateMany({
        where: {
          ticketToken,
          scannedAt: null
        },
        data: {
          scannedAt: new Date()
        }
      });

    const updated =
      result.count;

    if (updated === 0) {
      throw new ConflictError(
        "Ticket already scanned"
      );
    }
    return updated;
  }
}