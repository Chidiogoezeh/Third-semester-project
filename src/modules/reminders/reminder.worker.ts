import { Worker } from "bullmq";

import { env } from "../../config/env";
import { NotificationService }
  from "../../modules/notifications/notification.service";

new Worker(
  "event-reminders",
  async job => {
    const notification =
      new NotificationService();

    await notification.sendReminderEmail(
      job.data
    );
  },
  {
    connection: {
      host: new URL(env.REDIS_URL).hostname,
      port: Number(
        new URL(env.REDIS_URL).port
      ),
      password:
        new URL(env.REDIS_URL).password ||
        undefined
    }
  }
);