import crypto from "crypto";
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex")
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending"
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

inviteSchema.index({ email: 1, projectId: 1, status: 1 });
inviteSchema.index({ expiresAt: 1 });

export const Invite = mongoose.model("Invite", inviteSchema);
