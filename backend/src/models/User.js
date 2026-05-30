import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: function requirePassword() {
        return this.provider === "local" && !this.googleId;
      },
      minlength: 6,
      select: false
    },
    avatar: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      index: true,
      sparse: true
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student"
    },
    course: {
      type: String,
      trim: true,
      default: "General"
    },
    avatarColor: {
      type: String,
      default: "#14b8a6"
    },
    teams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }],
    lastLoginAt: {
      type: Date
    },
    resetPasswordToken: {
      type: String,
      select: false,
      sparse: true
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
      sparse: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
