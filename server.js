import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import { errorHandler } from "./middleware/error.js";
import { seedAdminUser } from "./utils/seedAdmin.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/requests", requestRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB().then(async () => {
  await seedAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
