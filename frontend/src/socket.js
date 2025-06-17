import { io } from "socket.io-client";

const socket = io("http://localhost:2100", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  autoConnect: true,
  transports: ["websocket"]
});

export default socket;

// process.env.REACT_APP_API_URL || 