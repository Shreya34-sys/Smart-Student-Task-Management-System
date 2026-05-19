import { Task } from "../models/Task.js";
import { getProductivityAdvice } from "../services/assistantService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const askAssistant = asyncHandler(async (req, res) => {
  const prompt = typeof req.body.prompt === "string" ? req.body.prompt.trim().slice(0, 600) : "";
  const tasks = await Task.find({ owner: req.user._id }).sort({ dueDate: 1 }).limit(20).lean();
  const advice = await getProductivityAdvice(tasks, prompt);
  res.json({ success: true, advice, meta: { taskCount: tasks.length, generatedAt: new Date().toISOString() } });
});
