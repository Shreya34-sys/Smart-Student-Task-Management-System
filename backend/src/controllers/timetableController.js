import { TimetableEntry } from "../models/TimetableEntry.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function toMinutes(value = "") {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

async function assertNoConflict(owner, payload, ignoreId) {
  const start = toMinutes(payload.startTime);
  const end = toMinutes(payload.endTime);
  if (!payload.startTime || !payload.endTime || start >= end) {
    throw new AppError("End time must be after start time", 400);
  }

  const entries = await TimetableEntry.find({
    owner,
    day: payload.day,
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {})
  });

  const conflict = entries.find((entry) => start < toMinutes(entry.endTime) && end > toMinutes(entry.startTime));
  if (conflict) throw new AppError(`Schedule conflict with ${conflict.subjectName}`, 409);
}

export const getTimetable = asyncHandler(async (req, res) => {
  const entries = await TimetableEntry.find({ owner: req.user._id }).sort({ day: 1, startTime: 1 });
  res.json({ success: true, entries });
});

export const createTimetableEntry = asyncHandler(async (req, res) => {
  await assertNoConflict(req.user._id, req.body);
  const entry = await TimetableEntry.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, entry });
});

export const updateTimetableEntry = asyncHandler(async (req, res) => {
  await assertNoConflict(req.user._id, req.body, req.params.id);
  const entry = await TimetableEntry.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
  if (!entry) throw new AppError("Timetable entry not found", 404);
  res.json({ success: true, entry });
});

export const deleteTimetableEntry = asyncHandler(async (req, res) => {
  const entry = await TimetableEntry.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!entry) throw new AppError("Timetable entry not found", 404);
  res.status(204).send();
});

export const getTodaySchedule = asyncHandler(async (req, res) => {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const entries = await TimetableEntry.find({ owner: req.user._id, day }).sort({ startTime: 1 });
  res.json({ success: true, day, entries });
});
