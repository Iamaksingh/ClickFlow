import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from "./src/config/db.js";
import cookieParser from 'cookie-parser';

import healthCheckRoutes from "./src/routes/healthCheck.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import linkRoutes from "./src/routes/link.routes.js";
import {redirectLink} from "./src/controllers/link.controller.js";
import { redirectLimiter } from "./src/middleware/rateLimiter.middleware.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.set('trust proxy', 1); // ✅ fixes the rate-limiter X-Forwarded-For error

// ✅ Single allowedOrigins definition — delete the old one
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(o => o.trim().replace(/\/+$/, "").toLowerCase())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/health", healthCheckRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.get("/:shortCode", redirectLimiter, redirectLink);

const startServer = async () => { 
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect DB", error);
    process.exit(1);
  }
};

startServer();