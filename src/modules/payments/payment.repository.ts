import {
  Prisma,
  PaymentStatus
} from "@prisma/client";

import { prisma } from "../../config/database";

export class PaymentRepository {
  async create(
    data: Prisma.PaymentUncheckedCreateInput
  ) {
    return prisma.payment.create({
      data
    });
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: {
        id
      },
      include: {
        event: true,
        eventee: true,
        ticket: true
      }
    });
  }

  async findByReference(
    reference: string
  ) {
    return prisma.payment.findUnique({
      where: {
        reference
      },
      include: {
        event: true,
        eventee: true,
        ticket: true
      }
    });
  }

  async updateStatus(
    reference: string,
    status: PaymentStatus
  ) {
    return prisma.payment.update({
      where: {
        reference
      },
      data: {
        status,
        paidAt:
          status ===
          PaymentStatus.SUCCESS
            ? new Date()
            : null
      }
    });
  }
}