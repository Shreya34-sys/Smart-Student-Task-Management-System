import express from "express";
import { createTeam, getTeams, inviteMember } from "../controllers/teamController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getTeams).post(createTeam);
router.post("/:id/invite", inviteMember);

export default router;
