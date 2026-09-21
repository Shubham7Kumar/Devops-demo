// ======================================================
// DEVOPS NOTEBOOK — DATABASE CONNECTION
// ======================================================

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    // Stop the application because the API cannot
    // work correctly without its required database.
    process.exit(1);
  }
};

export default connectDB;