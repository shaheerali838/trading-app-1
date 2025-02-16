import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

// Create HTTP server
const server = http.createServer(app);

console.log(process.env.FRONTEND_URL);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("placeOrder", (data) => {
    io.emit("tradeUpdate", data);
  });
});

export { io };

// Function to emit trade updates
export const emitTradeUpdate = (trade) => {
  io.emit("tradeUpdate", trade);
};

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} and will get requests from ${process.env.FRONTEND_URL}`);
});
