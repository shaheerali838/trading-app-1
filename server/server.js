import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import app from "./app.js";
import { checkLiquidations } from "./controllers/futuresTradeController.js";

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
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

export const emitTradeUpdate = (trade) => {
  io.emit("tradeUpdate", trade);
};

const marketPrices = {};

const connectWebSocket = () => {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

  ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.s && data.c) {
        const pair = data.s; // Example: BTCUSDT
        const price = parseFloat(data.c); // Latest price

        marketPrices[pair] = price;

        await checkLiquidations(marketPrices);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed. Reconnecting...");
    setTimeout(connectWebSocket, 5000); // Retry connection after 5 seconds
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    ws.close();
  };

  ws.on("unexpected-response", (req, res) => {
    console.error(`Unexpected server response: ${res.statusCode}`);
    ws.close();
  });
};

connectWebSocket();

setInterval(async () => {
  console.log("Running periodic liquidation check...");
  await checkLiquidations(marketPrices);
}, 30000); // Runs every 30 seconds

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} and will get requests from ${process.env.FRONTEND_URL}`
  );
});
