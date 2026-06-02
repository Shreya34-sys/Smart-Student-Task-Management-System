import { Task } from "../models/Task.js";
import { PomodoroSession } from "../models/PomodoroSession.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysAgo(days) {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
}

function dateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export const getProductivityAnalytics = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });
  const sessions = await PomodoroSession.find({ owner: req.user._id, completed: true, completedAt: { $gte: daysAgo(30) } });
  const now = new Date();
  const weekStart = daysAgo(6);
  const monthStart = daysAgo(29);

  const completed = tasks.filter((task) => task.status === "completed");
  const completedThisWeek = completed.filter((task) => task.updatedAt >= weekStart);
  const completedThisMonth = completed.filter((task) => task.updatedAt >= monthStart);
  const pending = tasks.filter((task) => task.status !== "completed");
  const overdue = pending.filter((task) => task.dueDate < now);

  const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
    const day = daysAgo(6 - index);
    const key = dateKey(day);
    return {
      date: key,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      completed: completed.filter((task) => dateKey(task.updatedAt) === key).length,
      focusMinutes: sessions.filter((session) => dateKey(session.completedAt) === key).reduce((sum, session) => sum + session.focusMinutes, 0)
    };
  });

  const categoryMap = completedThisMonth.reduce((acc, task) => {
    acc[task.subject] = (acc[task.subject] || 0) + 1;
    return acc;
  }, {});

  const mostProductiveDay = weeklyTrend.reduce((best, day) => day.completed > best.completed ? day : best, weeklyTrend[0]);
  const completionPercentage = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

  res.json({
    success: true,
    analytics: {
      weekly: {
        completed: completedThisWeek.length,
        pending: pending.length,
        completionPercentage,
        mostProductiveDay: mostProductiveDay?.label || "N/A",
        averageCompletionTimeHours: 0,
        trend: weeklyTrend
      },
      monthly: {
        completed: completedThisMonth.length,
        byCategory: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
        productivityScore: Math.min(100, Math.round(completionPercentage * 0.7 + Math.min(sessions.length * 3, 30))),
        overdue: overdue.length
      },
      trends: weeklyTrend
    }
  });
});
