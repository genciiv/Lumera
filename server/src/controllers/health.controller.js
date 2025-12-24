import mongoose from "mongoose";

export function health(req, res) {
  res.json({ status: "ok", service: "lumera-api" });
}

export function dbTest(req, res) {
  res.json({ mongoReadyState: mongoose.connection.readyState });
}
