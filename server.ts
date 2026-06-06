import "./src/modules/reminders/reminder.worker";
import app from "./src/app";
import { env } from "./src/config/env";
import { prisma } from "./src/config/database";
import { logger } from "./src/shared/utils/logger";
import { Server } from "http";
import { reminderWorker } from "./src/modules/reminders/reminder.worker";

let server: Server | null = null;

async function bootstrap() {
  await prisma.$connect();

  server = app.listen(env.PORT, () => {
    logger.info(
      `Server running on port ${env.PORT}`
    );
  });
}

async function shutdown(signal: string) {
  logger.info(
    `Received ${signal}. Starting graceful shutdown...`
  );

  try {
    if (server) {
      await new Promise<void>((resolve, reject) =>
        server!.close(err =>
          err ? reject(err) : resolve()
        )
      );
    }

    if (reminderWorker) {
      await reminderWorker.close();
    }

    await prisma.$disconnect();

    logger.info(
      "Graceful shutdown completed"
    );

    process.exit(0);
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

bootstrap().catch(error => {
  logger.error(error);
  process.exit(1);
});

process.on("SIGINT", () =>
  shutdown("SIGINT")
);

process.on("SIGTERM", () =>
  shutdown("SIGTERM")
);