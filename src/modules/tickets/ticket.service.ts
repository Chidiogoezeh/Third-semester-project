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
      throw AppError.forbidden(
        "You are not authorized to verify tickets for this event"
      );
    }

    if (ticket.isScanned) {
      throw AppError.conflict(
        "Ticket already scanned"
      );
    }

    const updatedTicket =
      await prisma.ticket.update({
        where: {
          id: ticket.id
        },
        data: {
          isScanned: true,
          scannedAt: new Date()
        }
      });

    return updatedTicket;
  }
}