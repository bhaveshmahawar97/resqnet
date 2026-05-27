import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== "production";

// General API rate limit (e.g. max 100 requests per 15 minutes per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
    errors: []
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints (e.g. max 10 requests per 15 mins)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 10,
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes",
    errors: []
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for AI/Rescue creation endpoints to prevent spam/abuse
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 150 : 15,
  message: {
    success: false,
    message: "Rate limit exceeded for strict operations. Please wait before submitting more requests.",
    errors: []
  },
  standardHeaders: true,
  legacyHeaders: false,
});
