// server/src/index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import inviteRoutes from "./routes/invites.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.json({ ok: true, name: "Lumera API" }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api", inviteRoutes);

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connect failed:", err.message);
    process.exit(1);
  });
