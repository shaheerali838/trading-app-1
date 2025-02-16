import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Trade from "../models/Trade.js";
import Transaction from "../models/Transaction.js"; // Ensure you import the Transaction model
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import {io} from "../server.js";

export const fetchUsers = async(req, res, next) => {
    try{

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
    console.log("got an approve order request");
    
    const { orderId } = req.params;
    console.log("Order ID:", orderId);
    
    const trade = await Trade.findById(orderId);
    if (!trade) return res.status(404).json({ message: "Order not found" });

    const wallet = await Wallet.findOne({ userId: trade.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    let totalCost = trade.quantity * trade.price;

    if (trade.type === "buy") {
      wallet.balanceUSDT -= totalCost;
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
        wallet.holdings = wallet.holdings.filter((h) => h.asset !== trade.asset);
      }
      wallet.balanceUSDT += totalCost;
    }

    await wallet.save();
    trade.status = "approved";
    await trade.save();

    io.emit("orderApproved", trade);

    res.status(200).json({ message: "Order approved successfully", trade });
  } catch (error) {
    console.error("Error approving order:", error);
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
    console.error("Error rejecting order:", error);
    res.status(500).json({ message: "Error rejecting order", error });
  }
});

