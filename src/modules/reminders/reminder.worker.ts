import { Queue, Worker } from "bullmq";
import { env } from "../../config/env";
import { NotificationService } from "../notifications/notification.service";

const redisConnection = env.REDIS_URL
  ? {
      host: new URL(env.REDIS_URL).hostname,
      port: Number(new URL(env.REDIS_URL).port),
      password:
        new URL(env.REDIS_URL).password || undefined
    }
  : null;

export const reminderQueue =
  redisConnection
    ? new Queue("event-reminders", {
        connection: redisConnection
      })
    : null;

export const reminderWorker =
  redisConnection
    ? new Worker(
        "event-reminders",
        async job => {
          const notification =
            new NotificationService();

          await notification.sendReminderEmail(
            job.data
          );
        },
        {
          connection: redisConnection
        }
      )
    : null;

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