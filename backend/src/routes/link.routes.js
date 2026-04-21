import express from "express";
import {createLink, getUserLinks, deleteLink, updateLink} from "../controllers/link.controller.js";
import protect from "../middleware/auth.middleware.js";
import { getLinkStats } from "../controllers/stats.controller.js";
import { linkCreationLimiter, statsLimiter, } from "../middleware/rateLimiter.middleware.js";
const linkRoutes = express.Router();

//define route for creating a new short link
linkRoutes.post("/",protect,linkCreationLimiter, createLink);  
//define route for getting stats of a specific link
linkRoutes.get("/:id/stats", statsLimiter, getLinkStats);
//define route for getting all links for the authenticated user
linkRoutes.get("/", protect, statsLimiter, getUserLinks);
//define route for updating a link (e.g., name)
linkRoutes.put("/:id", protect, updateLink);
//define route for deleting a link
linkRoutes.delete("/:id", protect, deleteLink);

export default linkRoutes;  //export the router to be used in the main application file