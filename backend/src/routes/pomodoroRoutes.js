import express from "express";
import { createPomodoroSession, getPomodoroStats } from "../controllers/pomodoroController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/stats", getPomodoroStats);
router.post("/sessions", createPomodoroSession);

export default router;
