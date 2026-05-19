import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      enum: ["task", "team", "user", "system"],
      default: "system"
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
