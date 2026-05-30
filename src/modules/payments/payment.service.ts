import crypto from "crypto";

import { prisma } from "../../config/database";

import { PaymentRepository } from "./payment.repository";

import { WebhookService } from "./webhook.service";

import { BadRequestError } from "../../shared/errors/badRequest";

const repository = new PaymentRepository();

const webhookService = new WebhookService();

export class PaymentService {
  async createBookingSession(
    eventId: string,
    eventeeId: string
  ) {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });

    if (!event) {
      throw new BadRequestError(
        "Event not found"
      );
    }

    const reference =
      crypto.randomUUID();

    const payment =
      await repository.create({
        eventId,
        eventeeId,
        amount: event.price,
        reference,
        status: "PENDING"
      });

    return {
      paymentId: payment.id,
      reference,
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

    const event = JSON.parse(payload);

    if (
      event.event !== "charge.success"
    ) {
      return {
        verified: true
      };
    }

    const reference =
      event.data.reference;

    const payment =
      await repository.findByReference(
        reference
      );

    if (!payment) {
      throw new BadRequestError(
        "Payment not found"
      );
    }

    await repository.updateStatus(
      reference,
      "SUCCESS"
    );

    // Ticket creation belongs here
    // QR generation belongs here
    // Reminder scheduling belongs here

    return {
      verified: true
    };
  }
}