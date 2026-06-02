import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import activityRoutes from "./routes/activityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import externalRoutes from "./routes/externalRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pomodoroRoutes from "./routes/pomodoroRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
export const allowedOrigins = env.clientUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(logger);
app.use(apiLimiter);
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Smart Student Task API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/timetable", timetableRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
