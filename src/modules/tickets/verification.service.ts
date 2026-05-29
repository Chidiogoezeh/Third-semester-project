import { TicketRepository } from "./ticket.repository";

import { BadRequestError } from "../../shared/errors/badRequest";

const repository = new TicketRepository();

export class VerificationService {
  async verify(ticketToken: string) {
    const ticket =
      await repository.findByToken(ticketToken);

    if (!ticket) {
      throw new BadRequestError(
        "Invalid ticket"
      );
    }

    if (ticket.isScanned) {
      throw new BadRequestError(
        "Ticket already scanned"
      );
    }

    return repository.markAsScanned(ticket.id);
  }
}