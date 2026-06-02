import express from "express";
import { getProductivityAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getProductivityAnalytics);

export default router;
