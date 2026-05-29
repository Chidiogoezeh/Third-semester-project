export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export type PaymentSuccessTemplateData = {
  email: string;
  eventTitle: string;
  amount: number;
};

export type ReminderTemplateData = {
  email: string;
  eventTitle: string;
  eventDate: Date;
  location: string;
};

export type TicketTemplateData = {
  email: string;
  eventTitle: string;
  qrCode: string;
  eventDate: Date;
  location: string;
};