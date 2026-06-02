import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotes);
router.post("/", upload.single("file"), createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
