import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", authLimiter, signup);
authRoutes.post("/login", authLimiter, login);

export default authRoutes;