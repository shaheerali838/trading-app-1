import Wallet from "../models/Wallet.js";
import Trade from "../models/Trade.js";
import { io } from "../server.js"; // Import WebSocket instance
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const placeOrder = catchAsyncErrors(async (req, res) => {
  try {
    const { type, orderType, price, amount, coin } = req.body; // Added tradeType to specify spot or futures

    if (!["buy", "sell"].includes(type)) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    if (amount <= 0 || (orderType === "limit" && price <= 0)) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    let totalCost = amount * price;
    console.log("totalCost", totalCost);
    console.log("wallet.spotWallet", wallet.spotWallet);
    // Ensure user has enough Spot Wallet balance
    if (type === "buy" && wallet.spotWallet < totalCost) {
      return res.status(400).json({
        message:
          "Insufficient funds in Spot Wallet. Transfer funds from Exchange Wallet.",
      });
    }

    if (type === "buy") {
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
      await trade.save();
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
      await trade.save();
      io.emit("tradeUpdate", trade);
    }

    res.status(200).json({ message: "Order Successful" });
  } catch (error) {
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

// Transfer funds from one wallet to wallet
export const transferFunds = catchAsyncErrors(async (req, res) => {
  const { fromWallet, toWallet, amount } = req.body;
  const userId = req.user._id;

  try {
    // Fetch user wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Validate wallet types
    const validWallets = [
      "exchangeWallet",
      "spotWallet",
      "futuresWallet",
      "perpetualsWallet",
    ];
    if (
      !validWallets.includes(fromWallet) ||
      !validWallets.includes(toWallet)
    ) {
      return res.status(400).json({ message: "Invalid wallet type" });
    }

    // Validate balance
    const transferAmount = Number(amount); // Ensure the amount is a number
    if (wallet[fromWallet] < transferAmount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Process transfer with proper addition
    wallet[fromWallet] = Number(wallet[fromWallet] - transferAmount);
    wallet[toWallet] = Number(wallet[toWallet] + transferAmount);

    // Log transfer in history
    wallet.transferHistory.push({
      fromWallet,
      toWallet,
      amount: transferAmount,
    });

    await wallet.save();

    res.status(200).json({ message: "Transfer successful", wallet });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer", error });
  }
});
