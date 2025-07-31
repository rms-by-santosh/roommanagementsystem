import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from "./routes/userRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import requestNotifyRoutes from "./routes/requestNotifyRoutes.js"; // ✅ added

// Middleware and utilities
import { errorHandler } from "./middleware/error.js";
import { seedAdminUser } from "./utils/seedAdmin.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://room-ms.netlify.app/api",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API ROUTES
app.use("/users", userRoutes);
app.use("/sheets", sheetRoutes);
app.use("/requests", requestRoutes);
app.use("/notify", requestNotifyRoutes); // ✅ placed BEFORE error handler

// ✅ ERROR HANDLER (must be last)
app.use(errorHandler);

// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedAdminUser();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
   
