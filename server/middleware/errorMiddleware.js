import { sendError } from "../utils/apiResponse.js";

/**
 * Global Error Handler Middleware
 * Catches all unhandled async exceptions and Zod validation errors.
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER CAUGHT AN EXCEPTION:");
  console.error(err);

  // Zod Validation Error (if it bypassed the request validator somehow)
  if (err.name === "ZodError") {
    return sendError(res, {
      status: 400,
      message: "Validation Error",
      error: process.env.NODE_ENV !== "production" ? err.errors : "Invalid input data",
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    return sendError(res, {
      status: 409, // Conflict
      message: `${duplicateField} already exists. Please use a different value.`,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return sendError(res, {
      status: 400,
      message: "Validation Error",
      error: process.env.NODE_ENV !== "production" ? messages : "Invalid input data",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, {
      status: 401,
      message: "Invalid token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, {
      status: 401,
      message: "Your token has expired. Please log in again.",
    });
  }

  // Default Fallback
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendError(res, {
    status: statusCode,
    message: message,
    error: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

/**
 * Route Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(res, {
    status: 404,
    message: `API Route Not Found - ${req.originalUrl}`,
  });
};
