import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket Server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

// WebSocket Events
io.on("connection", (socket) => {
  console.log(`WebSocket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`WebSocket disconnected: ${socket.id}`);
  });
});

// Function to emit trade updates
export const emitTradeUpdate = (trade) => {
  io.emit("tradeUpdate", trade);
};

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
