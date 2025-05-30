import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

let isConnected = false; // Track the connection status

export const connectDB = async () => {
   // console.log(process.env.MONGO_URI);
   

    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI as string, {
        
        });

        isConnected = connection.readyState === 1;

        if (isConnected) {
            console.log("MongoDB is already connected.");
            return;
        } else {
            console.log("MongoDB connected successfully.");
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
