import express from "express";
import {
  createTask,
  deleteTask,
  assignTask,
  emailTaskSummary,
  exportTasksPdf,
  getAnalytics,
  getTask,
  getTasks,
  updateTask,
  uploadTaskFile
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validateTask } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.get("/analytics", getAnalytics);
router.get("/export/pdf", exportTasksPdf);
router.post("/email-summary", emailTaskSummary);
router.route("/").get(getTasks).post(validateTask, createTask);
router.post("/:id/attachments", upload.single("file"), uploadTaskFile);
router.post("/:id/assign", assignTask);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default router;
