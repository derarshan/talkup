import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGO_URI)
    .then(console.log("🧿 Database alive."))
    .catch((error) => console.error("❌ Error while connecting database: ", error));
}