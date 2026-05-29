import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../services/activityService.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function sendAuthResponse(res, user, statusCode = 200) {
  const token = signToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      course: user.course,
      avatarColor: user.avatarColor,
      role: user.role,
      teams: user.teams || []
    }
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, course } = req.body;
  const user = await User.create({ name, email, password, course });
  await logActivity({ actor: user._id, action: "registered", entityType: "user", entityId: user._id });
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save();
  await logActivity({ actor: user._id, action: "logged_in", entityType: "user", entityId: user._id });
  sendAuthResponse(res, user);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential || !env.googleClientId) {
    throw new AppError("Google OAuth is not configured", 400);
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  const profile = await response.json();

  if (!response.ok || profile.aud !== env.googleClientId) {
    throw new AppError("Invalid Google credential", 401);
  }

  let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email }] });
  if (!user) {
    user = await User.create({
      googleId: profile.sub,
      name: profile.name,
      email: profile.email,
      avatar: profile.picture || "",
      provider: "google",
      avatarColor: "#0ea5e9",
      lastLoginAt: new Date()
    });
  } else {
    user.googleId = user.googleId || profile.sub;
    user.avatar = user.avatar || profile.picture || "";
    user.provider = user.provider === "local" ? "google" : user.provider;
    user.lastLoginAt = new Date();
    await user.save();
  }

  await logActivity({ actor: user._id, action: "google_login", entityType: "user", entityId: user._id });
  sendAuthResponse(res, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "course", "avatarColor"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select("-password");

  res.json({ success: true, user });
});
