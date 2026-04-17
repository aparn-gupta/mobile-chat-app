import { io } from "socket.io-client";

let socket = null;

// let socketAddress = "https://mychatapp-ntgv.onrender.com";
let socketAddress = "http://localhost:3002";

const createSocket = () => {
  if (!socket) {
    socket = io(socketAddress, {
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const connectSocket = (user) => {
  const s = createSocket();

  s.on("connect", () => {
    console.log("socket connected" + s.id);
  });

  if (!s.connected) {
    s.connect();
    s.on("connect", () => {
      console.log("socket connected" + s.id);
    });
    s.emit("register", user);
  }

  return s;
};
