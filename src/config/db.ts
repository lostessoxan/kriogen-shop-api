import mongoose from "mongoose";
import env from "../utils/validateEnv";

const connectDB = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI!);

      console.log(`MongoDB Connected: ${conn.connection.host}`);

      resolve("Success");
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      reject(error.message);
    }
  });
};

export default connectDB;
