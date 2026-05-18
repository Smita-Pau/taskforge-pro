const mongoose = require("mongoose");
// Ensure env variables are loaded (only needed if not already called in your main entry file)
require("dotenv").config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    // Capture the connection object to read metadata safely
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Optional: Keep this if you want the app to crash on a standalone backend server
    process.exit(1);
  }
};

module.exports = connectDB;
