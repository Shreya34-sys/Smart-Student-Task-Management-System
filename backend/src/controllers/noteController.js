import fs from "fs";
import { Note } from "../models/Note.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function fileUrl(req, file) {
  return `${req.protocol}://${req.get("host")}/${file.path.replaceAll("\\", "/")}`;
}

export const getNotes = asyncHandler(async (req, res) => {
  const filter = { owner: req.user._id };
  if (req.query.subject && req.query.subject !== "all") filter.subject = req.query.subject;
  if (req.query.favorite === "true") filter.favorite = true;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const notes = await Note.find(filter).sort({ createdAt: -1 });
  const subjects = await Note.distinct("subject", { owner: req.user._id });
  res.json({ success: true, notes, subjects });
});

export const createNote = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("PDF or image file is required", 400);
  const mimetype = req.file.mimetype;
  const type = mimetype === "application/pdf" ? "pdf" : "image";
  const note = await Note.create({
    owner: req.user._id,
    title: req.body.title,
    subject: req.body.subject,
    type,
    url: fileUrl(req, req.file),
    originalName: req.file.originalname
  });
  res.status(201).json({ success: true, note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
  if (!note) throw new AppError("Note not found", 404);
  res.json({ success: true, note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!note) throw new AppError("Note not found", 404);
  if (note.url.includes("/uploads/")) {
    const localPath = note.url.split("/uploads/")[1];
    fs.rm(`uploads/${localPath}`, { force: true }, () => {});
  }
  res.status(204).send();
});
