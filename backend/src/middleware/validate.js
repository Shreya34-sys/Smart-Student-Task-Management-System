import { AppError } from "../utils/AppError.js";

const emailPattern = /^\S+@\S+\.\S+$/;

export function validateRegister(req, _res, next) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || name.trim().length < 2) return next(new AppError("Name must be at least 2 characters", 400));
  if (!emailPattern.test(email || "")) return next(new AppError("Valid email is required", 400));
  if (!password || password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }
  if (password !== confirmPassword) return next(new AppError("Passwords do not match", 400));

  next();
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body;

  if (!emailPattern.test(email || "")) return next(new AppError("Valid email is required", 400));
  if (!password) return next(new AppError("Password is required", 400));

  next();
}

export function validateTask(req, _res, next) {
  const { title, dueDate } = req.body;

  if (!title || title.trim().length < 3) return next(new AppError("Task title must be at least 3 characters", 400));
  if (!dueDate || Number.isNaN(Date.parse(dueDate))) return next(new AppError("Valid due date is required", 400));

  next();
}
