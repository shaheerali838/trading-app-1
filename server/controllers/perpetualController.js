import Wallet from "../models/Wallet.js";
import PerpetualTrade from "../models/PerpetualTrade.js";
import FundingRate from "../models/FundingRate.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const openPerpetualPosition = catchAsyncErrors(async (req, res) => {
  const { pair, type, leverage, quantity, entryPrice } = req.body;
  const userId = req.user._id;

  if (!["long", "short"].includes(type)) {
    return res.status(400).json({ message: "Invalid trade type" });
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const marginUsed = (quantity * entryPrice) / leverage;

  if (wallet.perpetualsWallet < marginUsed) {
    return res
      .status(400)
      .json({
        message:
          "Insufficient funds in Perpetuals Wallet. Transfer funds from Exchange Wallet.",
      });
  }

  let liquidationPrice =
    type === "long"
      ? entryPrice * (1 - 1 / leverage)
      : entryPrice * (1 + 1 / leverage);

  wallet.perpetualsWallet -= marginUsed;
  await wallet.save();

  const trade = await PerpetualTrade.create({
    userId,
    pair,
    type,
    leverage,
    entryPrice,
    quantity,
    marginUsed,
    liquidationPrice,
  });

  res.status(201).json({
    message: "Perpetual position opened successfully",
    trade,
  });
});

export const closePerpetualPosition = catchAsyncErrors(async (req, res) => {
  const { tradeId, closePrice } = req.body;
  const userId = req.user._id;

  const trade = await PerpetualTrade.findOne({ _id: tradeId, userId });

  if (!trade) return res.status(404).json({ message: "Trade not found" });
  if (trade.status !== "open")
    return res.status(400).json({ message: "Trade is already closed" });

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  let profitLoss =
    trade.type === "long"
      ? (closePrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - closePrice) * trade.quantity;

  wallet.perpetualsWallet += trade.marginUsed + profitLoss;
  if (wallet.balanceUSDT < 0) {
    wallet.balanceUSDT = 0;
  }
  await wallet.save();

  trade.status = "closed";
  trade.closedAt = new Date();
  await trade.save();

  res.status(200).json({
    message: "Perpetual position closed successfully",
    profitLoss,
  });
});

export const applyFundingRates = async () => {
  const rates = await FundingRate.find();
  const openTrades = await PerpetualTrade.find({ status: "open" });

  for (const trade of openTrades) {
    const rate = rates.find((r) => r.pair === trade.pair)?.rate || 0;
    const fundingFee = (trade.marginUsed * rate) / 100;

    const wallet = await Wallet.findOne({ userId: trade.userId });

    if (trade.type === "long") {
      wallet.balanceUSDT -= fundingFee;
    } else {
      wallet.balanceUSDT += fundingFee;
    }

    trade.fundingFee += fundingFee;
    await trade.save();
    await wallet.save();
  }
};

export const fetchOpenPerpetualTrades = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const trades = await PerpetualTrade.find({
        userId: req.user._id,
        status: "open",
      });
      res.status(200).json({
        success: true,
        trades,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);
