import path from "path";
import multer from "multer";
import { AppError } from "../utils/AppError.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(_req, file, callback) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    if (!allowed.includes(file.mimetype)) return callback(new AppError("Unsupported file type", 400));
    callback(null, true);
  }
});
