import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";

// ✅ Load .env from server/.env (root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS (në dev mund të jetë 5173)
// Me Vite proxy, request vjen nga 5173 gjithsesi.
// Keep it:
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => res.json({ ok: true, name: "Lumera API" }));

// ✅ Routes (vetëm 1 herë secila)
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tenantRoutes);

// --- Start server ---
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
      console.log("JWT_ACCESS_SECRET loaded:", !!process.env.JWT_ACCESS_SECRET);
    });
  })
  .catch((err) => {
    console.error("❌ DB connect failed:", err.message);
    process.exit(1);
  });
