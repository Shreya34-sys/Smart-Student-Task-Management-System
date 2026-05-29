import express from "express";
import { getMe, googleLogin, login, register, updateProfile, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter, forgotPasswordLimiter } from "../middleware/rateLimiter.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/google", authLimiter, googleLogin);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
