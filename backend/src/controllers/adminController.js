import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  if (!["student", "mentor", "admin"].includes(req.body.role)) {
    throw new AppError("Invalid role", 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select("-password");

  res.json({ success: true, user });
});
