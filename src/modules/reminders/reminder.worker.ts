import { Worker }
  from "bullmq";

import { env }
  from "../../config/env";

new Worker(
  "event-reminders",
  async job => {
    console.log(job.data);
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