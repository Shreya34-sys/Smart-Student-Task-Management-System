import mongoose from "mongoose";

const pomodoroSessionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    focusMinutes: {
      type: Number,
      min: 1,
      default: 25
    },
    breakMinutes: {
      type: Number,
      min: 1,
      default: 5
    },
    completed: {
      type: Boolean,
      default: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ owner: 1, completedAt: -1 });

export const PomodoroSession = mongoose.model("PomodoroSession", pomodoroSessionSchema);
