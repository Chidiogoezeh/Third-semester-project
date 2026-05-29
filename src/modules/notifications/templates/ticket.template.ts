import { TicketTemplateData } from "../notification.types";

export function ticketTemplate(
  data: TicketTemplateData
) {
  return `
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
        ${new Date(
          data.eventDate
        ).toLocaleString()}
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
        Please present this QR code
        at the event entrance.
      </p>
    </div>
  `;
}