import { env } from "../config/env.js";

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "An account with this email already exists";
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired. Please log in again";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.nodeEnv === "production" ? undefined : error.stack
  });
}
