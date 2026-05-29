import crypto from "crypto";

import {
  Prisma
} from "@prisma/client";

import { prisma } from "../../config/database";

import { TicketRepository } from "./ticket.repository";

import { BadRequestError } from "../../shared/errors/badRequest";

import { ConflictError } from "../../shared/errors/conflict";

const repository =
  new TicketRepository();

export class TicketService {
  async bookTicket(
    eventId: string,
    eventeeId: string
  ) {
    return prisma.$transaction(
      async (tx) => {
        const event =
          await tx.event.findUnique({
            where: {
              id: eventId
            }
          });

        if (!event) {
          throw new BadRequestError(
            "Event not found"
          );
        }

        if (
          new Date(event.eventDate) <
          new Date()
        ) {
          throw new BadRequestError(
            "Cannot book past events"
          );
        }

        if (
          event.creatorId ===
          eventeeId
        ) {
          throw new ConflictError(
            "Creators cannot book their own events"
          );
        }

        const existingTicket =
          await tx.ticket.findFirst({
            where: {
              eventId,
              eventeeId
            }
          });

        if (existingTicket) {
          throw new ConflictError(
            "Ticket already booked"
          );
        }

        if (event.capacity) {
          const soldTickets =
            await tx.ticket.count({
              where: {
                eventId
              }
            });

          if (
            soldTickets >=
            event.capacity
          ) {
            throw new ConflictError(
              "Event is sold out"
            );
          }
        }

        const ticket =
          await tx.ticket.create({
            data: {
              eventId,
              eventeeId,
              ticketToken:
                crypto.randomUUID()
            },
            include: {
              event: true,
              eventee: {
                select: {
                  id: true,
                  email: true,
                  role: true
                }
              }
            }
          });

        return ticket;
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable
      }
    );
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