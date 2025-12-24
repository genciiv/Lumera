import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import apiRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

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

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));

  return app;
}
