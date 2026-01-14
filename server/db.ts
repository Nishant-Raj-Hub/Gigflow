import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be set in environment");
}

export async function connectDb() {
  await mongoose.connect(process.env.MONGO_URI as string, {
  });
}

export { mongoose };
