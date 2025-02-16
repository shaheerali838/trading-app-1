import Wallet from "../models/Wallet.js";
import Trade from "../models/Trade.js";
import { io } from "../server.js"; // Import WebSocket instance
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const placeOrder = catchAsyncErrors(async (req, res) => {
  try {
    const { type, orderType, price, amount, coin } = req.body;

    console.log(req.body);

    if (!["buy", "sell"].includes(type)) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    if (amount <= 0 || (orderType === "limit" && price <= 0)) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    let totalCost = amount * price;

    if (type === "buy") {
      // Ensure user has enough USDT balance
      if (wallet.balanceUSDT < totalCost) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      
      const trade = await Trade.create({
        userId: req.user._id,
        type,
        orderType,
        price,
        quantity: amount, // This is the quantity being traded
        totalCost,
        asset: coin, // Add the asset (coin) being traded
        status: "pending",
      });
      await trade.save()
      io.emit("tradeUpdate", trade);

    } else {

      // Use the `coin` from the request to find the correct holding
      const holding = wallet.holdings.find((h) => h.asset === coin);
      if (!holding || holding.quantity < amount) {
        return res.status(400).json({ message: "Insufficient crypto balance" });
      }

      const trade = await Trade.create({
        userId: req.user._id,
        type,
        orderType,
        price,
        quantity: amount, // This is the quantity being traded
        totalCost,
        asset: coin, // Add the asset (coin) being traded
        status: "pending",
      });
      await trade.save()
      io.emit("tradeUpdate", trade);
    }



    // Emit real-time trade update

    res.status(200).json({ message: "Order Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get User Trade History
export const getTradeHistory = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trade history", error });
  }
};

// Get Wallet Balance & Holdings
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet details", error });
  }
};

export const fetchPendingOrders = async (req, res, next) => {
  try {
    const transactions = await Trade.find({ status: "pending" });
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};