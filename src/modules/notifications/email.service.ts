import nodemailer from "nodemailer";

import { env } from "../../config/env";

import { SendEmailOptions } from "./notification.types";

const transporter =
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

export class EmailService {
  async sendEmail(
    options: SendEmailOptions
  ) {
    return transporter.sendMail({
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html
    });
  }
}