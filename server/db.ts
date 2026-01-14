import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be set in environment");
}

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export { mongoose };
