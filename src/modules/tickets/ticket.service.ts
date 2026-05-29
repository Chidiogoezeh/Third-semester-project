import crypto from "crypto";

import { TicketRepository } from "./ticket.repository";

import { BadRequestError } from "../../shared/errors/badRequest";

import { ConflictError } from "../../shared/errors/conflict";

const repository = new TicketRepository();

export class TicketService {
  async bookTicket(
    eventId: string,
    eventeeId: string
  ) {
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
      await repository.findByToken(
        ticketToken
      );

    if (!ticket) {
      throw new BadRequestError(
        "Invalid ticket"
      );
    }

    if (ticket.isScanned) {
      throw new ConflictError(
        "Ticket already scanned"
      );
    }

    return repository.markAsScanned(
      ticket.id
    );
  }
}