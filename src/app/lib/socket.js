import { io } from "socket.io-client";

let socket = null;

const createSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const connectSocket = () => {
  const s = createSocket();

  s.on("connect", () => {
    console.log("connected" + s.id);
  });

  if (!s.connected) {
    s.connect();
    s.on("connect", () => {
      console.log("socket connected" + s.id);
    });
  }

  return s;
};
