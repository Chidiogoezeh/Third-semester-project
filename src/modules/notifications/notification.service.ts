import { EmailService } from "./email.service";

import {
  paymentSuccessTemplate,
  reminderTemplate,
  ticketTemplate
} from "./templates";

import {
  PaymentSuccessTemplateData,
  ReminderTemplateData,
  TicketTemplateData
} from "./notification.types";

const emailService =
  new EmailService();

export class NotificationService {
  async sendPaymentSuccessEmail(
    data: PaymentSuccessTemplateData
  ) {
    const html =
      paymentSuccessTemplate(data);

    return emailService.sendEmail({
      to: data.email,
      subject: "Payment Successful",
      html
    });
  }

  async sendReminderEmail(
    data: ReminderTemplateData
  ) {
    const html =
      reminderTemplate(data);

    return emailService.sendEmail({
      to: data.email,
      subject: "Event Reminder",
      html
    });
  }

  async sendTicketEmail(
    data: TicketTemplateData
  ) {
    const html =
      ticketTemplate(data);

    return emailService.sendEmail({
      to: data.email,
      subject: "Your Event Ticket",
      html
    });
  }
}