import crypto from "crypto";
import { prisma } from "../../config/database";
import { NotificationService } from "../notifications/notification.service";
import { AppError } from "../../shared/errors/appError";
import {  generateQRCode } from "../../shared/utils/qr";
import { PaystackService } from "./paystack.service";
import { scheduleReminder } from "../reminders/reminder.worker";

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
      throw AppError.badRequest(
        "Event not found"
      );
    }

    if (
      event.creatorId === eventeeId
    ) {
      throw AppError.badRequest(
        "Creators cannot book their own event"
      );
    }

    if (
      event.eventDate < new Date()
    ) {
      throw AppError.badRequest(
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
      throw AppError.badRequest(
        "Ticket already purchased"
      );
    }

    const soldTickets =
      await prisma.ticket.count({
        where: {
          eventId
        }
      });

    if (
      event.capacity &&
      soldTickets >= event.capacity
    ) {
      throw AppError.badRequest(
        "Event sold out"
      );
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
      throw AppError.badRequest(
        "User not found"
      );
    }

    const checkout =
      await paystackService.initializeTransaction({
        email: eventee.email,
        amount: event.price,
        reference
      });

    await prisma.payment.create({
      data: {
        eventId,
        eventeeId,
        amount: event.price,
        reference,
        status: "PENDING"
      }
    });

    return {
      reference,
      authorizationUrl:
        checkout.authorization_url,
      accessCode:
        checkout.access_code
    };
  }

  async getCreatorPayments(
    creatorId: string
  ) {
    const payments =
      await prisma.payment.findMany({
        where: {
          event: {
            creatorId
          }
        },

        include: {
          event: {
            select: {
              id: true,
              title: true
            }
          },

          eventee: {
            select: {
              email: true
            }
          }
        },

        orderBy: {
          createdAt: "desc"
        }
      });

    const revenueResult =
      await prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: "SUCCESS",
          event: {
            creatorId
          }
        }
      });

    const totalRevenue =
      revenueResult._sum.amount ?? 0;

    const successfulPayments =
      payments.filter(
        payment =>
          payment.status === "SUCCESS"
      );

    const failedPayments =
      payments.filter(
        payment =>
          payment.status === "FAILED"
      );

    const pendingPayments =
      payments.filter(
        payment =>
          payment.status === "PENDING"
      );

    return {
      totalRevenue,

      totalPayments:
        payments.length,

      successfulPayments:
        successfulPayments.length,

      failedPayments:
        failedPayments.length,

      pendingPayments:
        pendingPayments.length,

      payments
    };
  }

  private async completePayment(
    reference: string
  ) {
    const payment =
      await prisma.payment.findUnique({
        where: {
          reference
        },
        include: {
          ticket: true,
          event: true,
          eventee: true
        }
      });

    if (!payment) {
      throw AppError.badRequest(
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
        async (tx) => {

          const event =
            await tx.event.findUnique({
              where: {
                id: payment.eventId
              }
            });

          const soldTickets =
            await tx.ticket.count({
              where: {
                eventId:
                  payment.eventId
              }
            });

          if (
            event?.capacity &&
            soldTickets >=
              event.capacity
          ) {
            throw AppError.badRequest(
              "Event sold out"
            );
          }

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
            await tx.ticket.upsert({
              where: {
                paymentId:
                  updatedPayment.id
              },
              update: {},
              create: {
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

    const qrCode =
      await generateQRCode(
        result.ticket.ticketToken
      );

    for (const offset of payment.event.creatorReminderOffsets) {
    const reminder =
      await prisma.reminder.create({
        data: {
          eventId: payment.eventId,
          userId: payment.eventeeId,
          reminderOffset: offset
        }
      });

    await scheduleReminder({
      reminderId: reminder.id,
      email: payment.eventee.email,
      eventTitle: payment.event.title,
      eventDate: payment.event.eventDate,
      location: payment.event.location,
      reminderOffset: offset
    });
}
    
    try {
      await notificationService.sendPaymentSuccessEmail({
        email: payment.eventee.email,
        eventTitle: payment.event.title,
        amount: payment.amount
      });
    } catch (error) {
      console.error("Payment email failed", error);
    }

    try {
      await notificationService.sendTicketEmail({
        email: payment.eventee.email,
        eventTitle: payment.event.title,
        qrCode,
        eventDate: payment.event.eventDate,
        location: payment.event.location
      });
    } catch (error) {
      console.error("Ticket email failed", error);
    }

    return {
      ticket: result.ticket,
      alreadyProcessed: false
    };
  }

  async verifyWebhook(
  payload: string,
  signature: string
) {
  const expectedSignature =
    crypto
      .createHmac(
        "sha512",
        process.env.PAYSTACK_SECRET_KEY!
      )
      .update(payload)
      .digest("hex");

  if (expectedSignature !== signature) {
    throw AppError.unauthorized(
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
    await prisma.payment.findUnique({
      where: {
        reference
      },
      include: {
        ticket: true,
        event: true,
        eventee: true
      }
    });

  if (!payment) {
    throw AppError.badRequest(
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

  const expectedAmount =
    payment.amount * 100;

  if (
    webhookEvent.data.amount !==
    expectedAmount
  ) {
    throw AppError.badRequest(
      "Payment amount mismatch"
    );
  }

  await this.completePayment(
    reference
  );

  return {
    verified: true
  };
}
}