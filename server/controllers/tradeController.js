import Wallet from "../models/Wallet.js";
import Trade from "../models/Trade.js";
import { io } from "../server.js"; // Import WebSocket instance
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { response } from "express";

export const placeOrder = catchAsyncErrors(async (req, res) => {
  try {
    const { type, orderType, price, usdtAmount, coin } = req.body; // Added tradeType to specify spot or futures

    if (!["buy", "sell"].includes(type)) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    if (usdtAmount <= 0 || (orderType === "limit" && price <= 0)) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    let quantity;
      const marketPrice = price; // Implement this function to get the current market price
      quantity = usdtAmount / marketPrice;


    let totalCost = usdtAmount;

    // Ensure user has enough Spot Wallet balance for buy orders
    if (type === "buy" && wallet.spotWallet < totalCost) {
      return res.status(400).json({
        message:
          "Insufficient funds in Spot Wallet.",
      });
    }

    if (type === "buy") {
      const trade = await Trade.create({
        userId: req.user._id,
        type,
        orderType,
        price,
        quantity, // This is the quantity being traded
        totalCost,
        asset: coin, // Add the asset (coin) being traded
        status: "pending",
      });
      await trade.save();
      io.emit("tradeUpdate", trade);
    } else {
      // Use the `coin` from the request to find the correct holding
      const holding = wallet.holdings.find((h) => h.asset === coin);
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient crypto balance" });
      }

      const trade = await Trade.create({
        userId: req.user._id,
        type,
        orderType,
        price,
        quantity, // This is the quantity being traded
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
  const { fromWallet, toWallet, asset, amount } = req.body;
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

    const transferAmount = Number(amount); // Ensure the amount is a number

    console.log("the asset is" + asset);

    // Validate balance for USDT transfers
    if (asset === "USDT") {
      if (wallet[fromWallet] < transferAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Process transfer with proper addition
      wallet[fromWallet] -= transferAmount;
      wallet[toWallet] += transferAmount;
    } else {
      // Handle asset transfers between exchange and spot wallets
      const fromHoldings =
        fromWallet === "spotWallet" ? wallet.holdings : wallet.exchangeHoldings;
      const toHoldings =
        toWallet === "spotWallet" ? wallet.holdings : wallet.exchangeHoldings;

      // Validate if fromHoldings is empty
      if (fromHoldings.length === 0) {
        return res
          .status(400)
          .json({ message: "Insufficient crypto balance" });
      }

      const fromHolding = fromHoldings.find(
        (holding) => holding.asset === asset
      );
      if (!fromHolding || fromHolding.quantity < transferAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct from the sender's holdings
      fromHolding.quantity -= transferAmount;
      if (fromHolding.quantity === 0) {
        fromHoldings.splice(fromHoldings.indexOf(fromHolding), 1);
      }

      // Add to the receiver's holdings
      const toHolding = toHoldings.find((holding) => holding.asset === asset);
      if (toHolding) {
        toHolding.quantity += transferAmount;
      } else {
        toHoldings.push({ asset, quantity: transferAmount });
      }
    }

    // Log transfer in history
    wallet.transferHistory.push({
      fromWallet,
      toWallet,
      asset,
      amount: transferAmount,
      timestamp: new Date(),
    });

    await wallet.save();

    res.status(200).json({ message: "Transfer successful", wallet });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer", error });
  }
});

export const getSpotTradesHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const trades = await Trade.find({
      userId,
      status: { $in: ["approved", "pending", "rejected"] },
    });
    console.log(
      "got a history request and this is a spot complete object: " + trades
    );

    res.status(200).json({ message: "Trades fetched successfully", trades });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trades", error });
  }
};
