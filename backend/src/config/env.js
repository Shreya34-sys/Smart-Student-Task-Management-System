import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const required = [
  { key: "MONGO_URI or MONGODB_URI", value: mongoUri },
  { key: "JWT_SECRET", value: process.env.JWT_SECRET }
];

for (const { key, value } of required) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.NODE_ENV === "production" && !process.env.CLIENT_URL) {
  throw new Error("Missing required environment variable: CLIENT_URL");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  serverUrl: process.env.SERVER_URL || "",
  redisUrl: process.env.REDIS_URL || "",
  quoteApiUrl: process.env.QUOTE_API_URL || "https://api.quotable.io/random",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  smtp: {
    host: process.env.SMTP_HOST || (process.env.EMAIL_USER ? "smtp.gmail.com" : ""),
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || process.env.EMAIL_USER || "",
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "",
    from: process.env.SMTP_FROM || "Smart Tasks <no-reply@smarttasks.local>"
  },
  openAiApiKey: process.env.OPENAI_API_KEY || ""
};
