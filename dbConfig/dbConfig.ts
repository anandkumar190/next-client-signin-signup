import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        
        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        connection.on('error', (error) => {
            console.log("MongoDB connection error. Make sure MongoDB is running: " + error);
        });
    } catch (error) {
        console.log("Something went wrong with DB connection!");
        console.log(error);
    }    
}