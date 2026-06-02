import { Notification } from "../models/Notification.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function deadlineState(task) {
  const now = Date.now();
  const due = new Date(task.dueDate).getTime();
  const hours = (due - now) / (1000 * 60 * 60);
  if (task.status === "completed") return "done";
  if (hours < 0) return "overdue";
  if (hours <= 24) return "due-soon";
  return "safe";
}

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(80);
  res.json({ success: true, notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  res.json({ success: true, notification });
});

export const getDeadlineAlerts = asyncHandler(async (req, res) => {
  const now = new Date();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const tasks = await Task.find({
    owner: req.user._id,
    status: { $ne: "completed" },
    dueDate: { $lte: nextWeek }
  }).sort({ dueDate: 1 });

  const alerts = tasks.map((task) => ({
    id: task._id,
    title: task.title,
    subject: task.subject,
    priority: task.priority,
    dueDate: task.dueDate,
    state: deadlineState(task),
    minutesRemaining: Math.round((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60))
  }));

  res.json({ success: true, alerts });
});
