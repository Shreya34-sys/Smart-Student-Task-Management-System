import app from "./app.js";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { startBackgroundJobs } from "./services/backgroundJobs.js";
import { initSocket } from "./services/socketService.js";

async function startServer() {
  fs.mkdirSync("uploads", { recursive: true });
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.clientUrl, "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
      credentials: true
    }
  });
  initSocket(io);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  startBackgroundJobs();

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error);
    server.close(() => process.exit(1));
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
