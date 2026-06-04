export type PaymentTemplateData = {
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

export const paymentTemplate = (
  data: PaymentTemplateData
) => `
  <div>
    <h2>Payment Successful</h2>

    <p>Hello,</p>

    <p>
      Your payment for
      <strong>${data.eventTitle}</strong>
      was successful.
    </p>

    <p>
      Amount Paid:
      ₦${(data.amount / 100).toFixed(2)}
    </p>

    <p>Your ticket has been generated successfully.</p>

    <p>Thank you for using Eventful.</p>
  </div>
`;

export const reminderTemplate = (
  data: ReminderTemplateData
) => `
  <div>
    <h2>Event Reminder</h2>

    <p>Hello,</p>

    <p>This is a reminder for your upcoming event:</p>

    <p>
      <strong>${data.eventTitle}</strong>
    </p>

    <p>
      Date:
      ${new Date(data.eventDate).toLocaleString()}
    </p>

    <p>
      Location:
      ${data.location}
    </p>

    <p>We look forward to seeing you.</p>
  </div>
`;

export const ticketTemplate = (
  data: TicketTemplateData
) => `
  <div>
    <h2>Your Event Ticket</h2>

    <p>Hello,</p>

    <p>
      Your ticket for
      <strong>${data.eventTitle}</strong>
      is ready.
    </p>

    <p>
      Date:
      ${new Date(data.eventDate).toLocaleString()}
    </p>

    <p>
      Location:
      ${data.location}
    </p>

    <div>
      <img
        src="${data.qrCode}"
        alt="Ticket QR Code"
        width="250"
      />
    </div>

    <p>
      Please present this QR code at the event entrance.
    </p>
  </div>
`;