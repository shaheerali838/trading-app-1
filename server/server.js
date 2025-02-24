import http from "http";
import { Server } from "socket.io";
import axios from "axios";
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

const fetchMarketPrices = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    const data = response.data;
    if (data && data.bitcoin && data.bitcoin.usd) {
      const pair = "BTCUSDT"; // Example: BTCUSDT
      const price = parseFloat(data.bitcoin.usd); // Latest price

      marketPrices[pair] = price;

      await checkLiquidations(marketPrices);
    }
  } catch (error) {
    console.error("Error fetching market prices:", error);
  }
};

setInterval(fetchMarketPrices, 10000); // Fetch market prices every 10 seconds

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
