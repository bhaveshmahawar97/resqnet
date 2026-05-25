import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { CORE_DB_NAME, AI_DB_NAME, isCoreConnected, isAiConnected } from "./config/database.js";
import { CORE_COLLECTIONS, AI_COLLECTIONS } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import rescueRoutes from "./routes/rescue.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/users.js";
import adoptionRoutes from "./routes/adoption.js";
import notificationRoutes from "./routes/notifications.js";
import ngoRoutes from "./routes/ngos.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "../backend/routes/reportRoutes.js";

import { globalErrorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const envFile = fs.existsSync(path.resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS origin not allowed: ${requestOrigin}`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 ResQNet Backend Running",
    data: {
      databases: {
        core: CORE_DB_NAME,
        ai: AI_DB_NAME,
      },
      collections: {
        core: CORE_COLLECTIONS,
        ai: AI_COLLECTIONS,
      },
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResQNet API healthy",
    data: {
      databases: {
        core: { name: CORE_DB_NAME, connected: isCoreConnected() },
        ai: { name: AI_DB_NAME, connected: isAiConnected() },
      },
      uptime: process.uptime(),
      cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/rescue", rescueRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/report", reportRoutes(express));

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
