let ioInstance = null;

export function initSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("join:team", (teamId) => {
      if (teamId) socket.join(`team:${teamId}`);
    });
  });
}

export function notifyUser(userId, payload) {
  if (ioInstance && userId) ioInstance.to(`user:${userId}`).emit("notification", payload);
}

export function notifyTeam(teamId, payload) {
  if (ioInstance && teamId) ioInstance.to(`team:${teamId}`).emit("notification", payload);
}
