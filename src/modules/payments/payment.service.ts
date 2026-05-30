import crypto from "crypto";

import { prisma } from "../../config/database";

import { PaymentRepository } from "./payment.repository";
import { WebhookService } from "./webhook.service";

import { NotificationService } from "../notifications/notification.service";

import { BadRequestError } from "../../shared/errors/badRequest";

const repository = new PaymentRepository();

const webhookService = new WebhookService();

const notificationService =
  new NotificationService();

export class PaymentService {
  async createBookingSession(
    eventId: string,
    eventeeId: string
  ) {
    const event =
      await prisma.event.findUnique({
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
      event.creatorId === eventeeId
    ) {
      throw new BadRequestError(
        "Creators cannot book their own event"
      );
    }

    if (
      event.eventDate < new Date()
    ) {
      throw new BadRequestError(
        "Cannot book past events"
      );
    }

    const existingTicket =
      await prisma.ticket.findFirst({
        where: {
          eventId,
          eventeeId
        }
      });

    if (existingTicket) {
      throw new BadRequestError(
        "Ticket already purchased"
      );
    }

    if (event.capacity) {
      const soldTickets =
        await prisma.ticket.count({
          where: {
            eventId
          }
        });

      if (
        soldTickets >=
        event.capacity
      ) {
        throw new BadRequestError(
          "Event is sold out"
        );
      }
    }

    const reference =
      crypto.randomUUID();

    const payment =
      await repository.create({
        event: {
          connect: {
            id: eventId
          }
        },
        eventee: {
          connect: {
            id: eventeeId
          }
        },
        amount: event.price,
        reference,
        status: "PENDING"
      });

    return {
      paymentId: payment.id,
      reference,

      // Replace with actual Paystack URL
      authorizationUrl:
        "https://checkout.paystack.com"
    };
  }

  async verifyWebhook(
    payload: string,
    signature: string
  ) {
    const isValid =
      webhookService.verifySignature(
        payload,
        signature
      );

    if (!isValid) {
      throw new BadRequestError(
        "Invalid webhook signature"
      );
    }

    const webhookEvent =
      JSON.parse(payload);

    if (
      webhookEvent.event !==
      "charge.success"
    ) {
      return {
        verified: true
      };
    }

    const reference =
      webhookEvent.data.reference;

    const payment =
      await repository.findByReference(
        reference
      );

    if (!payment) {
      throw new BadRequestError(
        "Payment not found"
      );
    }

    // Idempotency guard
    if (payment.ticket) {
      return {
        verified: true
      };
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedPayment =
            await tx.payment.update({
              where: {
                reference
              },
              data: {
                status: "SUCCESS",
                paidAt: new Date()
              }
            });

          const ticket =
            await tx.ticket.create({
              data: {
                eventId:
                  payment.eventId,
                eventeeId:
                  payment.eventeeId,
                paymentId:
                  updatedPayment.id,
                ticketToken:
                  crypto.randomUUID()
              }
            });

          return {
            payment:
              updatedPayment,
            ticket
          };
        }
      );

    await notificationService.sendPaymentSuccessEmail(
      {
        email:
          payment.eventee.email,
        amount:
          payment.amount,
        eventTitle:
          payment.event.title
      }
    );

    await notificationService.sendTicketEmail(
      {
        email:
          payment.eventee.email,
        eventTitle:
          payment.event.title,
        ticketToken:
          result.ticket.ticketToken,
        eventDate:
          payment.event.eventDate
      }
    );

    return {
      verified: true
    };
  }
}