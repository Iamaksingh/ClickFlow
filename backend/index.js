import dotenv from 'dotenv';
//configure dotenv for environment variables
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

//defining the port
const PORT = process.env.PORT || 5000;

//make an express app
const app = express();
app.set('trust proxy', 1);

const normalizeOrigin = (value) => value.replace(/\/+$/, "").toLowerCase();

const rawAllowedOrigins = process.env.FRONTEND_URL || "";
const allowedOrigins = rawAllowedOrigins
  .split(",")
  .map((origin) => origin.trim())
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

//defining the middleware
const allowedOrigins = [
  "https://link-tracker.vercel.app", // your main production URL
];

app.use(cors({
  origin: (origin, callback) => {
    // allow Vercel preview URLs + your production URL
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

//use health check routes
app.use("/health", healthCheckRoutes);

//use auth routes
app.use("/api/auth", authRoutes);

//use link routes 
app.use("/api/links", linkRoutes);

//define route for redirecting to the original URL when a short URL is accessed
app.get("/:shortCode", redirectLimiter, redirectLink);

//before starting the server, connect to the database 
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