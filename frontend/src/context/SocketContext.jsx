import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SocketContext = createContext(null);
const socketUrl = import.meta.env.VITE_SOCKET_URL;

if (!socketUrl) {
  throw new Error("Missing required frontend environment variable: VITE_SOCKET_URL");
}

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return undefined;

    const nextSocket = io(socketUrl, {
      transports: ["websocket"]
    });

    nextSocket.emit("join:user", user.id || user._id);
    user.teams?.forEach((teamId) => nextSocket.emit("join:team", teamId));
    nextSocket.on("notification", (payload) => showToast(`${payload.title}: ${payload.message}`));
    setSocket(nextSocket);

    return () => nextSocket.disconnect();
  }, [showToast, user]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
