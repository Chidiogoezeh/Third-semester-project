import crypto from "crypto";

import { prisma } from "../../config/database";

import { TicketRepository } from "./ticket.repository";

import { BadRequestError } from "../../shared/errors/badRequest";

import { ConflictError } from "../../shared/errors/conflict";

const repository =
  new TicketRepository();

export class TicketService {
  async createFromPayment(
    paymentId: string
  ) {
    const payment =
      await prisma.payment.findUnique({
        where: {
          id: paymentId
        },
        include: {
          event: true,
          eventee: true,
          ticket: true
        }
      });

    if (!payment) {
      throw new BadRequestError(
        "Payment not found"
      );
    }

    if (
      payment.status !== "SUCCESS"
    ) {
      throw new BadRequestError(
        "Payment not successful"
      );
    }

    if (payment.ticket) {
      return payment.ticket;
    }

    return repository.create({
      eventId: payment.eventId,
      eventeeId: payment.eventeeId,
      paymentId: payment.id,
      ticketToken:
        crypto.randomUUID()
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