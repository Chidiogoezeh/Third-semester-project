import { Worker } from "bullmq";

import { redis } from "../../config/redis";

import { NotificationService }
  from "../notifications/notification.service";

const notificationService =
  new NotificationService();

export const reminderWorker =
  new Worker(
    "event-reminders",

    async job => {
      await notificationService.sendReminderEmail(
        {
          email: job.data.email,
          eventTitle:
            job.data.eventTitle,
          eventDate:
            job.data.eventDate,
          location:
            job.data.location
        }
      );
    },

    {
      connection: redis
    }
  );