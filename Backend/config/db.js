import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ DB CONNECTED");

  } catch (error) {

    console.log("MongoDB Connection Error:", error.message);
    process.exit(1);

  }
};