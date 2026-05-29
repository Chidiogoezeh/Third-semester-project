import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { logger } from "./shared/utils/logger";

async function bootstrap() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      logger.info(
        `Server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}

bootstrap();

process.on("SIGINT", async () => {
  await prisma.$disconnect();

  process.exit(0);
});