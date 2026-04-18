import express from "express";
import {createLink, getUserLinks} from "../controllers/link.controller.js";
import protect from "../middleware/auth.middleware.js";
const linkRoutes = express.Router();

//define route for creating a new short link
linkRoutes.post("/",protect, createLink);  
//define route for getting all links for the authenticated user
linkRoutes.get("/", protect, getUserLinks);

export default linkRoutes;  //export the router to be used in the main application file