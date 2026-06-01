import crypto from "crypto";

import { prisma } from "../../config/database";

import { PaymentRepository } from "./payment.repository";
import { WebhookService } from "./webhook.service";

import { NotificationService } from "../notifications/notification.service";

import { BadRequestError } from "../../shared/errors/badRequest";

import { Prisma } from "@prisma/client";

import {  generateQRCode } from "../../shared/utils/qr";

import { PaystackService } from "./paystack.service";

const repository = new PaymentRepository();

const webhookService = new WebhookService();

const notificationService = new NotificationService();

const paystackService = new PaystackService();

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

    const eventee =
      await prisma.user.findUnique({
        where: {
          id: eventeeId
        }
      });

    if (!eventee) {
      throw new BadRequestError(
        "User not found"
      );
    }

    const payment =
      await repository.create({
        eventId,
        eventeeId,
        amount: event.price,
        reference,
        status: "PENDING"
      });

    const checkout =
      await paystackService.initializeTransaction({
        email: eventee.email,
        amount: event.price,
        reference
      });

    return {
        paymentId: payment.id,
        reference,
        authorizationUrl:
          checkout.authorization_url,
        accessCode:
          checkout.access_code
    };
  }

  private async completePayment(
    reference: string
  ) {
    const payment =
      await repository.findByReference(
        reference
      );

    if (!payment) {
      throw new BadRequestError(
        "Payment not found"
      );
    }

    // Already processed
    if (
      payment.status === "SUCCESS" &&
      payment.ticket
    ) {
      return {
        ticket: payment.ticket,
        alreadyProcessed: true
      };
    }

    const result =
      await prisma.$transaction(
        async (
          tx: Prisma.TransactionClient
        ) => {
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

          const existingTicket =
            await tx.ticket.findUnique({
              where: {
                paymentId: payment.id
              }
            });

          if (existingTicket) {
            return {
              payment: updatedPayment,
              ticket: existingTicket
            };
          }

          const ticket =
          await tx.ticket.upsert({
            where: {
              paymentId: updatedPayment.id
            },
            update: {},
            create: {
              eventId: payment.eventId,
              eventeeId: payment.eventeeId,
              paymentId: updatedPayment.id,
              ticketToken:
                crypto.randomUUID()
            }
          });

          return {
            payment: updatedPayment,
            ticket
          };
        }
      );

    const qrCode = 
      await generateQRCode(
        result.ticket.ticketToken
      );

    await notificationService.sendTicketEmail({
      email:
        payment.eventee.email,

      eventTitle:
        payment.event.title,

      qrCode,

      eventDate:
        payment.event.eventDate,

      location:
        payment.event.location
    });

    return {
      ticket: result.ticket,
      alreadyProcessed: false
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

  if (
    payment.status === "SUCCESS" &&
    payment.ticket
  ) {
    return {
      verified: true
    };
  }

  await this.completePayment(
    reference
  );

  return {
    verified: true
  };
}
  async verifyPayment(
    reference: string
  ) {
    const payment =
      await repository.findByReference(
        reference
      );

    if (!payment) {
      throw new BadRequestError(
        "Payment not found"
      );
    }

    const verification =
      await paystackService.verifyTransaction(
        reference
      );

    if (
      verification.status &&
      verification.data.status ===
        "success"
    ) {
      await this.completePayment(
        reference
      );
    }

    return verification.data;
  }
}