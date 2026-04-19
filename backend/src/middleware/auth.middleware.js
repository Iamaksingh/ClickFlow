import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
    try {
        //extract token from cookies
        const token = req.cookies.token;
        // 2. If no token
        if (!token) {
            return res.status(401).json(ApiResponse.error("Not authorized, no token"));
        }
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 4. Get user from DB (optional but recommended)
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json(ApiResponse.error("User not found"));
        }
        // 5. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json(ApiResponse.error("Not authorized, invalid token"));
    }
};

export default protect;