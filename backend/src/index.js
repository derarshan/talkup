import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./lib/db.lib.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "production"
    ? "https://talkup-zo5e.onrender.com"
    : "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
};


const PORT = process.env.PORT || 3001;
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🧿 Port: ${PORT} Alive.`);
        });
    } catch (err) {
        console.error("❌ Database died, can't start backend: ", err)
        process.exit(1);
    }
};

startServer();