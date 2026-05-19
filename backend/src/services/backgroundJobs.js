import { Task } from "../models/Task.js";

export function startBackgroundJobs() {
  setInterval(async () => {
    try {
      const overdueCount = await Task.countDocuments({
        status: { $ne: "completed" },
        dueDate: { $lt: new Date() }
      });
      if (overdueCount > 0) {
        console.log(`Background check: ${overdueCount} overdue tasks`);
      }
    } catch (error) {
      console.warn("Background task failed:", error.message);
    }
  }, 60 * 60 * 1000);
}
