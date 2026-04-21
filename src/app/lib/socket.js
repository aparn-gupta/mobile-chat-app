import { io } from "socket.io-client";

let socket = null;

// let socketAddress = "https://mychatapp-ntgv.onrender.com";
// let socketAddress = "http://localhost:3002";
let socketAddress =
  "http://ec2-18-61-95-198.ap-south-2.compute.amazonaws.com:4000";

const createSocket = () => {
  if (!socket) {
    socket = io(socketAddress, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const connectSocket = (user) => {
  const s = createSocket();

  s.off("connect");

  s.on("connect", () => {
    console.log("socket connected" + s.id);
    s.emit("register", user);
  });

  if (!s.connected) {
    s.connect();
  }

  return s;
};
