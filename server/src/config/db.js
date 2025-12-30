// server/src/config/db.js
import mongoose from "mongoose";

export async function connectDb() {
  if (!process.env.MONGO_URI) throw new Error("Missing Mongo URI");
  await mongoose.connect(process.env.MONGO_URI);
}
