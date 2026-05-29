import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import {
  swaggerUi,
  swaggerDocument
} from "./config/swagger";
import routes from "./routes";

import { apiLimiter } from "./middleware/rateLimit.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(pinoHttp());

app.use(apiLimiter);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Eventful API running"
  });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("/api/v1", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;