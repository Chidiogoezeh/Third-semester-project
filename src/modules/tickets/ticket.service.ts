import { AppError } from "../../shared/errors/appError";
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
      throw AppError.badRequest(
        "Invalid ticket"
      );
    }

    if (
      ticket.event.creatorId !==
      creatorId
    ) {
      throw AppError.badRequest(
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
      throw AppError.conflict(
        "Ticket already scanned"
      );
    }
    return updated;
  }
}