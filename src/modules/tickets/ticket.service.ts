import { TicketRepository } from "./ticket.repository";
import { BadRequestError } from "../../shared/errors/badRequest";
import { ConflictError } from "../../shared/errors/conflict";

const repository =
  new TicketRepository();

export class TicketService {
  async verifyTicket(
    ticketToken: string,
    creatorId: string
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

    if (
      ticket.event.creatorId !==
      creatorId
    ) {
      throw new BadRequestError(
        "You are not authorized to verify tickets for this event"
      );
    }

    const updated =
      await repository.scanTicket(
        ticketToken
      );

    if (updated === 0) {
      throw new ConflictError(
        "Ticket already scanned"
      );
    }
    return updated;
  }
}