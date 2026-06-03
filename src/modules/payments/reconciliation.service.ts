import { prisma } from "../../config/database";

import { PaystackService } from "./paystack.service";

import { PaymentService }
  from "./payment.service";

const paymentService =
  new PaymentService();

const paystack =
  new PaystackService();

export class ReconciliationService {
  async reconcilePayment(
    reference: string
  ) {
    const payment =
      await prisma.payment.findUnique({
        where: {
          reference
        }
      });

    if (!payment) {
      return null;
    }

    const verification =
      await paystack.verifyTransaction(
        reference
      );

    if (
    verification.status &&
    verification.data.status ===
        "success"
    ) {
    await paymentService.verifyPayment(
        reference
    );
    }

    return verification.data;
  }
}