import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "RushFood",
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ DB Error:", error.message);

    
  }
};

export default connectDB;