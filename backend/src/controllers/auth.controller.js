import jwt from "jsonwebtoken";
import ApiResponse from '../utils/apiResponse.js';
import User from "../models/User.model.js";
import validator from "validator";

const isProduction = process.env.NODE_ENV === "production";
const cookieSecure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : isProduction;
const cookieSameSite = process.env.COOKIE_SAME_SITE || (cookieSecure ? "none" : "lax");

const getCookieOptions = () => ({
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
});

//signup controller 
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {  // basic validation
            return res.status(400).json(ApiResponse.error('Email and password are required'));
        }
        if (!validator.isEmail(email, { require_tld: true })) {   //proper email check 
            return res.status(400).json(ApiResponse.error("Invalid email format"));
        }
        // check if user exists
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json(ApiResponse.error('User already exists, login instead of signup'));
        }
        // create user (password gets hashed automatically)
        const user = await User.create({ email: normalizedEmail, password });
        // generate token
        const token = generateToken(user._id);

        //using http cookies
        res.cookie("token", token, getCookieOptions());
        res.status(201).json(ApiResponse.success('User created'));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error('unable to signup', error.message));  //if unable to signup due to some reason 
    }
};

// login controller 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {  // basic validation
            return res.status(400).json(ApiResponse.error('Email and password are required'));
        }
        if (!validator.isEmail(email, { require_tld: true })) {   //proper email check 
            return res.status(400).json(ApiResponse.error("Invalid email format"));
        }
        // check user exists
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            return res.status(401).json(ApiResponse.error('Invalid credentials'));
        }
        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(ApiResponse.error('Invalid credentials'));
        }
        // generate token
        const token = generateToken(user._id);
        res.cookie("token", token, getCookieOptions());
        res.status(200).json(ApiResponse.success('Login successful'));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error('Server error'));
    }
};

//generate a new JWT token 
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: cookieSecure,
            sameSite: cookieSameSite,
            path: "/",
        });

        return res.status(200).json(ApiResponse.success("Logout successful"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(ApiResponse.error("Unable to logout"));
    }
};

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export { signup, login, logout };