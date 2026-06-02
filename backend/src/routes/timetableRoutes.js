import express from "express";
import {
  createTimetableEntry,
  deleteTimetableEntry,
  getTimetable,
  getTodaySchedule,
  updateTimetableEntry
} from "../controllers/timetableController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getTimetable);
router.get("/today", getTodaySchedule);
router.post("/", createTimetableEntry);
router.put("/:id", updateTimetableEntry);
router.delete("/:id", deleteTimetableEntry);

export default router;
