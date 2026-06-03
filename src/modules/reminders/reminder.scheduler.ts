import { reminderQueue } from "./reminder.queue";

export async function scheduleReminder(data: {
  reminderId: string;
  email: string;
  eventTitle: string;
  eventDate: Date;
  location: string;
  reminderOffset: number;
}) {
  if (!reminderQueue) {
    return;
  }

  const reminderTime = new Date(
    data.eventDate
  );

  reminderTime.setHours(
    reminderTime.getHours() -
      data.reminderOffset
  );

  const delay =
    reminderTime.getTime() -
    Date.now();

  if (delay <= 0) {
    return;
  }

  await reminderQueue.add(
    "event-reminder",
    {
      email: data.email,
      eventTitle: data.eventTitle,
      eventDate: data.eventDate,
      location: data.location
    },
    {
      delay,
      jobId: data.reminderId
    }
  );
}