import { Task } from "../models/Task.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearCacheByPrefix, getCache, setCache } from "../services/cacheService.js";
import { logActivity } from "../services/activityService.js";
import { sendTaskEmail } from "../services/emailService.js";
import { streamTasksPdf } from "../services/pdfService.js";
import { notifyTeam, notifyUser } from "../services/socketService.js";
import { User } from "../models/User.js";

function taskQuery(user, query) {
  const teamIds = user.teams || [];
  const visibility = {
    $or: [
      { owner: user._id },
      { assignedTo: user._id },
      { team: { $in: teamIds } }
    ]
  };
  const filter = { $and: [visibility] };

  if (query.status && query.status !== "all") filter.status = query.status;
  if (query.priority && query.priority !== "all") filter.priority = query.priority;
  if (query.team && query.team !== "all") filter.team = query.team;
  if (query.search) {
    filter.$and.push({
      $or: [
        { title: { $regex: query.search, $options: "i" } },
        { subject: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } }
      ]
    });
  }

  return filter;
}

function taskAccessQuery(user, taskId) {
  const filter = taskQuery(user, {});
  filter._id = taskId;
  return filter;
}

function sanitizeTaskPayload(user, body) {
  const payload = { ...body };
  if (payload.team === "") payload.team = null;
  if (payload.team && !(user.teams || []).some((teamId) => teamId.toString() === payload.team.toString())) {
    throw new AppError("You can only attach tasks to your own teams", 403);
  }
  return payload;
}

export const getTasks = asyncHandler(async (req, res) => {
  const cacheKey = `tasks:${req.user._id}:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  let tasksQuery = Task.find(taskQuery(req.user, req.query)).populate("assignedTo", "name email").populate("team", "name");

  if (req.query.sortBy === "priority") {
    tasksQuery = tasksQuery.sort({ priority: -1, dueDate: 1 });
  } else {
    const sortMap = {
      dueDate: { dueDate: 1 },
      createdAt: { createdAt: -1 },
      title: { title: 1 }
    };
    tasksQuery = tasksQuery.sort(sortMap[req.query.sortBy] || sortMap.dueDate);
  }

  const tasks = await tasksQuery;
  if (req.query.sortBy === "priority") {
    const priorityRank = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || new Date(a.dueDate) - new Date(b.dueDate));
  }
  const payload = { success: true, count: tasks.length, tasks };

  await setCache(cacheKey, payload, 60);
  res.json(payload);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne(taskAccessQuery(req.user, req.params.id));
  if (!task) throw new AppError("Task not found", 404);

  res.json({ success: true, task });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...sanitizeTaskPayload(req.user, req.body), owner: req.user._id });
  await clearCacheByPrefix(`tasks:${req.user._id}`);
  await logActivity({ actor: req.user._id, action: "created_task", entityType: "task", entityId: task._id, metadata: { title: task.title } });
  notifyUser(req.user._id.toString(), { title: "Task created", message: task.title });
  if (task.team) notifyTeam(task.team.toString(), { title: "New team task", message: task.title });

  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const payload = sanitizeTaskPayload(req.user, req.body);
  const task = await Task.findOneAndUpdate(
    taskAccessQuery(req.user, req.params.id),
    payload,
    { new: true, runValidators: true }
  );

  if (!task) throw new AppError("Task not found", 404);
  await clearCacheByPrefix(`tasks:${req.user._id}`);
  await logActivity({ actor: req.user._id, action: "updated_task", entityType: "task", entityId: task._id, metadata: { status: task.status } });
  notifyUser(req.user._id.toString(), { title: "Task updated", message: task.title });

  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) throw new AppError("Task not found", 404);

  await clearCacheByPrefix(`tasks:${req.user._id}`);
  await logActivity({ actor: req.user._id, action: "deleted_task", entityType: "task", entityId: task._id, metadata: { title: task.title } });
  res.status(204).send();
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const tasks = await Task.find(taskQuery(req.user, {})).populate("team", "name");
  const now = new Date();
  const statusBreakdown = ["todo", "in-progress", "completed"].map((status) => ({
    name: status,
    value: tasks.filter((task) => task.status === status).length
  }));
  const priorityBreakdown = ["high", "medium", "low"].map((priority) => ({
    name: priority,
    value: tasks.filter((task) => task.priority === priority).length
  }));
  const teamBreakdown = Object.values(tasks.reduce((acc, task) => {
    const key = task.team?._id?.toString() || "personal";
    acc[key] ||= { name: task.team?.name || "Personal", value: 0 };
    acc[key].value += 1;
    return acc;
  }, {}));

  const analytics = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    todo: tasks.filter((task) => task.status === "todo").length,
    overdue: tasks.filter((task) => task.status !== "completed" && task.dueDate < now).length,
    highPriority: tasks.filter((task) => task.priority === "high").length,
    statusBreakdown,
    priorityBreakdown,
    teamBreakdown
  };

  res.json({ success: true, analytics });
});

export const uploadTaskFile = asyncHandler(async (req, res) => {
  const task = await Task.findOne(taskAccessQuery(req.user, req.params.id));
  if (!task) throw new AppError("Task not found", 404);
  if (!req.file) throw new AppError("File is required", 400);

  task.attachments.push({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });
  await task.save();
  await logActivity({ actor: req.user._id, action: "uploaded_attachment", entityType: "task", entityId: task._id });
  res.status(201).json({ success: true, task });
});

export const exportTasksPdf = asyncHandler(async (req, res) => {
  const tasks = await Task.find(taskQuery(req.user, req.query)).sort({ dueDate: 1 });
  streamTasksPdf(res, tasks);
});

export const emailTaskSummary = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id, status: { $ne: "completed" } }).sort({ dueDate: 1 }).limit(10);
  const text = tasks.map((task) => `- ${task.title} (${task.priority}, due ${new Date(task.dueDate).toLocaleDateString()})`).join("\n");
  await sendTaskEmail({ to: req.user.email, subject: "Your Smart Tasks summary", text: text || "No open tasks. Nice work." });
  await logActivity({ actor: req.user._id, action: "emailed_task_summary", entityType: "user", entityId: req.user._id });
  res.json({ success: true, message: "Task summary email queued" });
});

export const assignTask = asyncHandler(async (req, res) => {
  const assignee = await User.findOne({ email: req.body.email });
  if (!assignee) throw new AppError("Assignee not found", 404);

  const task = await Task.findOneAndUpdate(
    taskAccessQuery(req.user, req.params.id),
    { $addToSet: { assignedTo: assignee._id } },
    { new: true }
  ).populate("assignedTo", "name email");

  if (!task) throw new AppError("Task not found", 404);
  notifyUser(assignee._id.toString(), { title: "Task assigned", message: task.title });
  await logActivity({ actor: req.user._id, action: "assigned_task", entityType: "task", entityId: task._id, metadata: { assignee: assignee.email } });
  res.json({ success: true, task });
});
