import express from "express";
import { getMe, googleLogin, login, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/google", authLimiter, googleLogin);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
