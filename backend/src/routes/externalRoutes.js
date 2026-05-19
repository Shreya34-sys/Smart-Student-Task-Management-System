import express from "express";
import { getQuote } from "../controllers/externalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/quote", protect, getQuote);

export default router;
