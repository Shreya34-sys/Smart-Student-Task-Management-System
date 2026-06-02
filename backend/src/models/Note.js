import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    type: {
      type: String,
      enum: ["pdf", "image"],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ""
    },
    originalName: {
      type: String,
      default: ""
    },
    favorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

noteSchema.index({ owner: 1, subject: 1, createdAt: -1 });
noteSchema.index({ title: "text", subject: "text", originalName: "text" });

export const Note = mongoose.model("Note", noteSchema);
