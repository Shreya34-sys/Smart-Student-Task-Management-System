import { PomodoroSession } from "../models/PomodoroSession.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const createPomodoroSession = asyncHandler(async (req, res) => {
  const session = await PomodoroSession.create({
    owner: req.user._id,
    focusMinutes: req.body.focusMinutes || 25,
    breakMinutes: req.body.breakMinutes || 5,
    completed: req.body.completed !== false,
    startedAt: req.body.startedAt || new Date(),
    completedAt: req.body.completedAt || new Date()
  });
  res.status(201).json({ success: true, session });
});

export const getPomodoroStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const today = startOfDay(now);
  const week = new Date(now);
  week.setDate(now.getDate() - 6);
  week.setHours(0, 0, 0, 0);

  const sessions = await PomodoroSession.find({ owner: req.user._id, completed: true, completedAt: { $gte: week } });
  const todaySessions = sessions.filter((session) => session.completedAt >= today);
  const weeklyFocusMinutes = sessions.reduce((sum, session) => sum + session.focusMinutes, 0);
  const dailyFocusMinutes = todaySessions.reduce((sum, session) => sum + session.focusMinutes, 0);

  res.json({
    success: true,
    stats: {
      sessionsToday: todaySessions.length,
      focusMinutesToday: dailyFocusMinutes,
      weeklyFocusHours: Math.round((weeklyFocusMinutes / 60) * 10) / 10,
      completedSessions: sessions.length,
      productivityScore: Math.min(100, Math.round((weeklyFocusMinutes / 600) * 100))
    }
  });
});
