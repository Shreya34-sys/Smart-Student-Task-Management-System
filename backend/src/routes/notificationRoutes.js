import express from "express";
import { getDeadlineAlerts, getNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.get("/deadlines", getDeadlineAlerts);
router.patch("/:id/read", markNotificationRead);

export default router;
