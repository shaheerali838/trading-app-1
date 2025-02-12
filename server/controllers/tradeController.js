import Wallet from "../models/Wallet.js";
import Trade from "../models/Trade.js";
import { emitTradeUpdate } from "../server.js";

// Buy Crypto
export const buyCrypto = async (req, res) => {
  try {
    const { asset, quantity, price } = req.body;
    const totalCost = quantity * price;

    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) return res.status(404).json({ msg: "Wallet not found" });

    if (wallet.balanceUSDT < totalCost) {
      return res.status(400).json({ msg: "Insufficient USDT balance" });
    }

    // Deduct USDT balance
    wallet.balanceUSDT -= totalCost;

    // Add or update crypto holdings
    const assetHolding = wallet.holdings.find((item) => item.asset === asset);
    if (assetHolding) {
      assetHolding.quantity += quantity;
    } else {
      wallet.holdings.push({ asset, quantity });
    }

    await wallet.save();

    // Record the trade
    const trade = new Trade({
      userId: req.user.userId,
      type: "buy",
      asset,
      quantity,
      price,
      totalCost,
    });
    await trade.save();
    emitTradeUpdate(trade);

    res.json({ msg: "Purchase successful", trade });
  } catch (error) {
    res.status(500).json({ msg: "Error processing purchase", error });
  }
};

// Sell Crypto
export const sellCrypto = async (req, res) => {
  try {
    const { asset, quantity, price } = req.body;
    const totalValue = quantity * price;

    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) return res.status(404).json({ msg: "Wallet not found" });

    const assetHolding = wallet.holdings.find((item) => item.asset === asset);
    if (!assetHolding || assetHolding.quantity < quantity) {
      return res.status(400).json({ msg: "Insufficient crypto balance" });
    }

    // Deduct crypto holdings
    assetHolding.quantity -= quantity;
    if (assetHolding.quantity === 0) {
      wallet.holdings = wallet.holdings.filter((item) => item.asset !== asset);
    }

    // Add USDT balance
    wallet.balanceUSDT += totalValue;

    await wallet.save();

    // Record the trade
    const trade = new Trade({
      userId: req.user.userId,
      type: "sell",
      asset,
      quantity,
      price,
      totalCost: totalValue,
    });
    await trade.save();
    emitTradeUpdate(trade);

    res.json({ msg: "Sale successful", trade });
  } catch (error) {
    res.status(500).json({ msg: "Error processing sale", error });
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
    res.status(500).json({ msg: "Error fetching trade history", error });
  }
};

// Get Wallet Balance & Holdings
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) return res.status(404).json({ msg: "Wallet not found" });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching wallet details", error });
  }
};
