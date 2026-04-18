import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
    try {
        let token;
        // 1. Extract token from header
        if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. If no token
        if (!token) {
            return res.status(401).json(ApiResponse.error("Not authorized, no token"));
        }
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 4. Get user from DB (optional but recommended)
        const user = await User.findById(decoded.userId);
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