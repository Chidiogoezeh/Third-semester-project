import { prisma } from "../../config/database";

export class PaymentRepository {
  async create(data: any) {
    return prisma.payment.create({
      data
    });
  }

  async updateStatus(
    reference: string,
    status: "SUCCESS" | "FAILED"
  ) {
    return prisma.payment.update({
      where: {
        reference
      },
      data: {
        status,
        paidAt:
          status === "SUCCESS"
            ? new Date()
            : null
      }
    });
  }

  async findByReference(
    reference: string
  ) {
    return prisma.payment.findUnique({
      where: {
        reference
      }
    });
  }
}