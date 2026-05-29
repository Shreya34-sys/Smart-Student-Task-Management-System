import express from "express";
import { acceptInvite, getInvite, getTeamInvites, sendInvite } from "../controllers/inviteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", protect, sendInvite);
router.get("/team/:teamId", protect, getTeamInvites);
router.get("/:token", getInvite);
router.post("/accept", protect, acceptInvite);

export default router;
