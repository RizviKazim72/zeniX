// lib/connectDB.ts
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "zenix",
    });

    isConnected = true;
    console.log(" MongoDB Connected Successfully ");
  } catch (error) {
    console.error(" MongoDB Connection Error: ", error);
    throw new Error("Database connection failed");
  }
};
