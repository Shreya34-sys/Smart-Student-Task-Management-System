import express from "express";
import { acceptInvite, getInvite, sendInvite } from "../controllers/inviteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", protect, sendInvite);
router.get("/:token", getInvite);
router.post("/accept", protect, acceptInvite);

export default router;
