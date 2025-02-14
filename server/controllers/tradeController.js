import Wallet from "../models/Wallet.js";
import Trade from "../models/Trade.js";
import { io } from "../server.js"; // Import WebSocket instance

export const placeOrder = async (req, res) => {
  try {
    const { type, orderType, price, amount } = req.body;

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

      // Deduct USDT and add crypto
      wallet.balanceUSDT -= totalCost;
      const holding = wallet.holdings.find((h) => h.asset === "BTC");
      if (holding) {
        holding.quantity += amount;
      } else {
        wallet.holdings.push({ asset: "BTC", quantity: amount });
      }
    } else {
      // Sell Crypto
      const holding = wallet.holdings.find((h) => h.asset === "BTC");
      if (!holding || holding.quantity < amount) {
        return res.status(400).json({ message: "Insufficient crypto balance" });
      }

      // Deduct Crypto and add USDT
      holding.quantity -= amount;
      if (holding.quantity === 0) {
        wallet.holdings = wallet.holdings.filter((h) => h.asset !== "BTC");
      }
      wallet.balanceUSDT += totalCost;
    }

    await wallet.save();

    // Record the trade
    const trade = await Trade.create({
      userId: req.user._id,
      type,
      orderType,
      price,
      amount,
      totalCost,
    });

    // Emit real-time trade update
    io.emit("tradeUpdate", trade);

    res.status(200).json({ message: "Trade successful", trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


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
