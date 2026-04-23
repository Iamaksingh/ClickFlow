import jwt from "jsonwebtoken";
import ApiResponse from '../utils/apiResponse.js';
import User from "../models/User.model.js";
import validator from "validator";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
});

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(ApiResponse.error('Email and password are required'));
        }
        if (!validator.isEmail(email, { require_tld: true })) {
            return res.status(400).json(ApiResponse.error("Invalid email format"));
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json(ApiResponse.error('User already exists, login instead of signup'));
        }
        const user = await User.create({ email: normalizedEmail, password });
        const token = generateToken(user._id);
        res.cookie("token", token, getCookieOptions());
        res.status(201).json(ApiResponse.success('User created'));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error('unable to signup', error.message));
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(ApiResponse.error('Email and password are required'));
        }
        if (!validator.isEmail(email, { require_tld: true })) {
            return res.status(400).json(ApiResponse.error("Invalid email format"));
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            return res.status(401).json(ApiResponse.error('Invalid credentials'));
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(ApiResponse.error('Invalid credentials'));
        }
        const token = generateToken(user._id);
        res.cookie("token", token, getCookieOptions());
        res.status(200).json(ApiResponse.success('Login successful'));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.error('Server error'));
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", getCookieOptions());
        return res.status(200).json(ApiResponse.success("Logout successful"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(ApiResponse.error("Unable to logout"));
    }
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export { signup, login, logout };