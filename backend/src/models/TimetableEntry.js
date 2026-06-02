import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["lecture", "practical"],
      required: true
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    facultyName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: ""
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    classroom: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ""
    },
    labName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ""
    },
    color: {
      type: String,
      default: "#14b8a6"
    }
  },
  { timestamps: true }
);

timetableEntrySchema.index({ owner: 1, day: 1, startTime: 1 });

export const TimetableEntry = mongoose.model("TimetableEntry", timetableEntrySchema);
