import { ReminderTemplateData } from "../notification.types";

export function reminderTemplate(
  data: ReminderTemplateData
) {
  return `
    <div>
      <h2>Event Reminder</h2>

      <p>Hello,</p>

      <p>
        This is a reminder for your upcoming event:
      </p>

      <p>
        <strong>${data.eventTitle}</strong>
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

      <p>
        We look forward to seeing you.
      </p>
    </div>
  `;
}