import crypto from "crypto";

import { TicketRepository } from "./ticket.repository";

import { ConflictError } from "../../shared/errors/conflict";

const repository = new TicketRepository();

export class TicketService {
  async verifyTicket(ticketToken: string) {
    const ticket =
      await repository.findByToken(ticketToken);

    if (!ticket) {
      throw new Error("Invalid ticket");
    }

    if (ticket.isScanned) {
      throw new ConflictError(
        "Ticket already scanned"
      );
    }

    return repository.markAsScanned(ticket.id);
  }
}