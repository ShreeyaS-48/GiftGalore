import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnection = async () => {
  const DB = process.env.DB;
  try {
    await mongoose.connect(DB).then(() => {
      console.log("Database is connected successfully");
    });
  } catch (err) {
    console.log(err);
    setTimeout(dbConnection, 5000); //try to connect again after 5 sec
  }
};

export default dbConnection;
