import rateLimit from "express-rate-limit";

// Aggressive (Auth)
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 mins
    max: 10,
    message: "Too many attempts, please try again later"
});

// Link Creation
const linkCreationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 mins
    max: 3
});

// Stats / Dashboard
const statsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 60
});

// Redirect (very high, almost unrestricted)
const redirectLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000
});

export { authLimiter, linkCreationLimiter, statsLimiter, redirectLimiter };