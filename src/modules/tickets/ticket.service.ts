import crypto from "crypto";

import { TicketRepository } from "./ticket.repository";

import { ConflictError } from "../../shared/errors/conflict";

import { NotFoundError } from "../../shared/errors/notFound";

import { prisma } from "../../config/database";

const repository = new TicketRepository();

export class TicketService {
  async bookTicket(
    eventId: string,
    eventeeId: string
  ) {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      throw new NotFoundError(
        "Event not found"
      );
    }

    return repository.create({
      eventId,
      eventeeId,
      ticketToken: crypto.randomUUID()
    });
  }

  async verifyTicket(
    ticketToken: string
  ) {
    const ticket =
      await repository.findByToken(ticketToken);

    if (!ticket) {
      throw new NotFoundError(
        "Invalid ticket"
      );
    }

    if (ticket.isScanned) {
      throw new ConflictError(
        "Ticket already scanned"
      );
    }

    return repository.markAsScanned(ticket.id);
  }
}