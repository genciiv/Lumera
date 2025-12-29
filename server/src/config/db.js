import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Missing Mongo URI");
  await mongoose.connect(uri);
}
