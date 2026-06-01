import { prisma } from "../../config/database";

import { PaystackService } from "./paystack.service";

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
      verification.data.status ===
      "success"
    ) {
      await prisma.payment.update({
        where: {
          reference
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date()
        }
      });
    }

    return verification.data;
  }
}