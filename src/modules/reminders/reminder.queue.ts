import { Queue } from "bullmq";

import { redis } from "../../config/redis";

export const reminderQueue =
  new Queue(
    "event-reminders",
    {
      connection: redis
    }
  );