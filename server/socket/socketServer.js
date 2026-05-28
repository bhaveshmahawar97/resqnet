import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;
const connectedUsers = new Map(); // userId -> socketId

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Will restrict this in production
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.userId})`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket.id);
    
    // Join role-based rooms
    socket.join(`role:${socket.userRole}`);
    
    // If NGO, join specific NGO room
    if (socket.userRole === "ngo") {
      socket.join("ngo_network");
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      connectedUsers.delete(socket.userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getConnectedUsers = () => connectedUsers;

export const emitToUser = (userId, event, payload) => {
  if (!io) return;
  const socketId = connectedUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, payload);
  }
};

export const emitToRole = (role, event, payload) => {
  if (!io) return;
  io.to(`role:${role}`).emit(event, payload);
};

export const emitToRoom = (room, event, payload) => {
  if (!io) return;
  io.to(room).emit(event, payload);
};

