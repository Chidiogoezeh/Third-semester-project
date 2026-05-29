import crypto from "crypto";

import { PaymentRepository } from "./payment.repository";

import { WebhookService } from "./webhook.service";

import { BadRequestError } from "../../shared/errors/badRequest";

const repository = new PaymentRepository();

const webhookService = new WebhookService();

export class PaymentService {
  async initializePayment(data: {
    ticketId: string;
    amount: number;
  }) {
    const reference =
      crypto.randomUUID();

    const payment =
      await repository.create({
        ticketId: data.ticketId,
        amount: data.amount,
        reference,
        status: "PENDING"
      });

    return {
      payment,
      authorizationUrl:
        "https://checkout.paystack.com",
      reference
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
      event.event === "charge.success"
    ) {
      const reference =
        event.data.reference;

      await repository.updateStatus(
        reference,
        "SUCCESS"
      );
    }

    if (
      event.event === "charge.failed"
    ) {
      const reference =
        event.data.reference;

      await repository.updateStatus(
        reference,
        "FAILED"
      );
    }

    return {
      verified: true
    };
  }

  async markPaymentSuccessful(
    reference: string
  ) {
    return repository.updateStatus(
      reference,
      "SUCCESS"
    );
  }

  async markPaymentFailed(
    reference: string
  ) {
    return repository.updateStatus(
      reference,
      "FAILED"
    );
  }
}