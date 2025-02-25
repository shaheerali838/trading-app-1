import http from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import axios from "axios";
import dotenv from "dotenv";
import app from "./app.js";
import { checkLiquidations } from "./controllers/futuresTradeController.js";

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server for real-time updates
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });

  socket.on("placeOrder", (data) => {
    io.emit("tradeUpdate", data);
  });
});

export { io };

export const emitTradeUpdate = (trade) => {
  io.emit("tradeUpdate", trade);
};

// Market prices storage
const marketPrices = {};

// Binance WebSocket for real-time market price updates
let ws;
const connectWebSocket = () => {
  try {
    ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onopen = () => {
      console.log("🔗 Connected to Binance WebSocket");
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.p) {
          const pair = "BTCUSDT";
          const price = parseFloat(data.p);

          marketPrices[pair] = price;

          // Trigger liquidation check
          await checkLiquidations(marketPrices);
        }
      } catch (error) {
        console.error("⚠️ Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error.message);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting in 5 seconds...");
      setTimeout(connectWebSocket, 5000);
    };
  } catch (error) {
    console.error("❌ Failed to connect WebSocket:", error.message);
  }
};

// Start WebSocket connection
connectWebSocket();

// Fallback: Periodic market price update using Binance REST API
const fetchMarketPrices = async () => {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );

    if (response.data && response.data.price) {
      const pair = "BTCUSDT";
      const price = parseFloat(response.data.price);

      marketPrices[pair] = price;

      await checkLiquidations(marketPrices);
    }
  } catch (error) {
    console.error("⚠️ Error fetching market prices:", error.message);
  }
};

// Fetch market prices every 30 seconds (fallback)
setInterval(fetchMarketPrices, 30000);

// Run liquidation checks every 30 seconds
setInterval(async () => {
  console.log("🔄 Running periodic liquidation check...");
  await checkLiquidations(marketPrices);
}, 30000);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}, frontend: ${process.env.FRONTEND_URL}`);
});
