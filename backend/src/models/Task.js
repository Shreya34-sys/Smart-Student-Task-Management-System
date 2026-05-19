import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
      default: ""
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "General"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo"
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1, dueDate: 1 });
taskSchema.index({ title: "text", subject: "text", description: "text" });

export const Task = mongoose.model("Task", taskSchema);
