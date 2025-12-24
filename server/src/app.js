import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRoutes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  // Routes
  app.use("/api", apiRoutes);

  // 404 + Error handler
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
