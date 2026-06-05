import { AppError } from "../../shared/errors/appError";
import { prisma } from "../../config/database";

export class TicketService {

  async getUserTickets(
    eventeeId: string
  ) {
    return prisma.ticket.findMany({
      where: {
        eventeeId
      },

      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            eventDate: true,
            bannerUrl: true
          }
        },

        payment: {
          select: {
            amount: true,
            status: true,
            paidAt: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

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