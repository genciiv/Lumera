import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "../routes/auth.routes.js";
import usersRoutes from "../routes/users.routes.js";

import { HttpError } from "./HttpError.js";

export function createApp() {
  const app = express();

  app.use(morgan("dev"));

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (req, res) => res.json({ ok: true }));

  // API routes
  app.use("/api", authRoutes);
  app.use("/api", usersRoutes);

  // 404
  app.use((req, res, next) => {
    next(new HttpError(404, "Not found"));
  });

  // error handler
  app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Server error";
    console.error("🔥 Error:", err);
    res.status(statusCode).json({ error: message });
  });

  return app;
}
