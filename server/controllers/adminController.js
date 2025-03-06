import axios from "axios";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import FuturesTrade from "../models/FuturesTrade.js";
import PerpetualTrade from "../models/PerpetualTrade.js";
import Trade from "../models/Trade.js";
import Transaction from "../models/Transaction.js"; // Ensure you import the Transaction model
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import { io } from "../server.js";

export const fetchUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const approveOrder = catchAsyncErrors(async (req, res) => {
  try {

    const { orderId } = req.params;

    const trade = await Trade.findById(orderId);
    if (!trade) return res.status(404).json({ message: "Order not found" });

    const wallet = await Wallet.findOne({ userId: trade.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    let totalCost = trade.quantity * trade.price;

    if (trade.type === "buy") {
      if (wallet.spotWallet < totalCost) {
        return res.status(400).json({ message: "Insufficient funds in spot wallet" });
      }
      wallet.spotWallet -= totalCost;
      const holding = wallet.holdings.find((h) => h.asset === trade.asset);
      if (holding) {
        holding.quantity += trade.quantity;
      } else {
        wallet.holdings.push({ asset: trade.asset, quantity: trade.quantity });
      }
    } else {
      const holding = wallet.holdings.find((h) => h.asset === trade.asset);
      if (!holding) {
        return res.status(400).json({ message: "Holding not found" });
      }
      holding.quantity -= trade.quantity;
      if (holding.quantity === 0) {
        wallet.holdings = wallet.holdings.filter(
          (h) => h.asset !== trade.asset
        );
      }
      wallet.spotWallet += totalCost;
    }

    await wallet.save();
    trade.status = "approved";
    await trade.save();    

    io.emit("orderApproved", trade);

    res.status(200).json({ message: "Order approved successfully", trade });
  } catch (error) {
    res.status(500).json({ message: "Error approving order", error });
  }
});

export const rejectOrder = catchAsyncErrors(async (req, res) => {
  try {
    const { orderId } = req.params;
    const trade = await Trade.findById(orderId);
    if (!trade) return res.status(404).json({ message: "Order not found" });

    trade.status = "rejected";
    await trade.save();

    io.emit("orderRejected", trade);

    res.status(200).json({ message: "Order rejected successfully", trade });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting order", error });
  }
});

export const fetchOpenTrades = async (req, res) => {
  try {
    const futuresTrades = await FuturesTrade.find({ status: "open" });
    const perpetualTrades = await PerpetualTrade.find({
      status: "open",
    });

    const openTrades = [...futuresTrades, ...perpetualTrades];

    res.status(200).json({
      message: "successfully found the open trades",
      trades: openTrades,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching open trades" });
  }
};


export const liquidateTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { marketPrice } = req.body; // Receive market price from frontend

    if (!marketPrice) {
      return res.status(400).json({ message: "Market price is required" });
    }

    let trade = await FuturesTrade.findById(tradeId);
    if (!trade) {
      trade = await PerpetualTrade.findById(tradeId);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
    }

    if (trade.status !== "open") {
      return res.status(400).json({ message: "Trade is already closed" });
    }

    // Use the market price received from the frontend
    const closePrice = parseFloat(marketPrice);

    // Find the user and wallet
    const user = await User.findById(trade.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // **Calculate Profit/Loss**
    let profitLoss;
    if (trade.type === "long") {
      profitLoss = (closePrice - trade.entryPrice) * trade.quantity;
    } else {
      profitLoss = (trade.entryPrice - closePrice) * trade.quantity;
    }

    // **Update User Wallet Balance**
    wallet.balanceUSDT += profitLoss;
    if (wallet.balanceUSDT < 0) {
      wallet.balanceUSDT = 0;
    }
    await wallet.save();

    // **Update trade status to "liquidated"**
    trade.status = "liquidated";
    await trade.save();

    res.status(200).json({
      message: "Trade liquidated successfully",
      profitLoss,
      newBalance: wallet.balanceUSDT,
    });
  } catch (error) {
    res.status(500).json({ message: "Error liquidating trade", error: error.message });
  }
};
