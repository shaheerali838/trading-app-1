import Wallet from "../models/Wallet.js";
import FuturesTrade from "../models/FuturesTrade.js";
import FundingRate from "../models/FundingRate.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import PerpetualTrade from "../models/PerpetualTrade.js";
import { io } from "../server.js"; // Import WebSocket instance
import axios from "axios";

export const openFuturesPosition = catchAsyncErrors(async (req, res) => {
  const {
    pair,
    type,
    leverage,
    time,
    quantity, // Quantity of crypto (optional)
    entryPrice,
    assetsAmount,
    tradeType,
    amountInUSDT, // New field: Amount of USDT to allocate
  } = req.body;
  const userId = req.user._id;

  // Validate required fields
  if (
    !pair ||
    !type ||
    !leverage ||
    !entryPrice ||
    !assetsAmount ||
    (!quantity && !amountInUSDT) // Require either quantity or amountInUSDT
  ) {
    return res.status(400).json({ message: "Kindly fill in all fields" });
  }

  // Validate trade type
  if (!["long", "short"].includes(type)) {
    return res.status(400).json({ message: "Invalid trade type" });
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  let calculatedQuantity = quantity;

  // If amountInUSDT is provided, calculate the quantity of crypto
  if (amountInUSDT) {
    calculatedQuantity = amountInUSDT / entryPrice; // Quantity = USDT Amount / Entry Price
  }

  // Calculate required margin
  const marginUsed = (calculatedQuantity * entryPrice) / leverage;

  const availableMargin = wallet.futuresWallet * (assetsAmount / 100);

  if (availableMargin < marginUsed) {
    return res.status(400).json({
      message:
        "Insufficient funds in Perpetuals Wallet based on the specified assets amount.",
    });
  }

  // Calculate liquidation price (approximate formula)
  let liquidationPrice;
  if (type === "long") {
    liquidationPrice = entryPrice * (1 - 1 / leverage);
  } else {
    liquidationPrice = entryPrice * (1 + 1 / leverage);
  }

  // Calculate expiry time based on leverage value
  let expiryTime = new Date();
  switch (leverage.toString()) {
    case "20": // 30s
      expiryTime.setSeconds(expiryTime.getSeconds() + 30);
      break;
    case "30": // 60s
      expiryTime.setMinutes(expiryTime.getMinutes() + 1);
      break;
    case "50": // 120s
      expiryTime.setMinutes(expiryTime.getMinutes() + 2);
      break;
    case "60": // 24h
      expiryTime.setHours(expiryTime.getHours() + 24);
      break;
    case "70": // 48h
      expiryTime.setHours(expiryTime.getHours() + 48);
      break;
    case "80": // 72h
      expiryTime.setHours(expiryTime.getHours() + 72);
      break;
    case "90": // 7d
      expiryTime.setDate(expiryTime.getDate() + 7);
      break;
    case "100": // 15d
      expiryTime.setDate(expiryTime.getDate() + 15);
      break;
    default:
      expiryTime.setHours(expiryTime.getHours() + 24); // Default 24h
  }

  // Deduct margin from user's wallet
  wallet.futuresWallet -= marginUsed;
  await wallet.save();

  // Save trade to database
  const futuresTrade = await FuturesTrade.create({
    userId,
    pair,
    type,
    tradeType,
    assetsAmount,
    leverage,
    time,
    entryPrice,
    quantity: calculatedQuantity, // Use calculated quantity
    marginUsed,
    liquidationPrice,
    expiryTime, // Add expiry time
    status: "open",
  });

  // Emit events for real-time updates
  io.emit("newFuturesTrade", futuresTrade);
  io.emit("newPosition", futuresTrade);

  res.status(201).json({
    message: "Futures position opened successfully",
    trade: futuresTrade,
  });
});

export const closeFuturesPosition = catchAsyncErrors(async (req, res) => {
  const { tradeId, closePrice } = req.body;
  const userId = req.user._id;

  const trade = await FuturesTrade.findOne({ _id: tradeId, userId });

  if (!trade) {
    return res.status(404).json({ message: "Trade not found" });
  }

  if (trade.status !== "open") {
    return res.status(400).json({ message: "Trade is already closed" });
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  // Calculate profit/loss
  let profitLoss;
  if (trade.type === "long") {
    profitLoss = (closePrice - trade.entryPrice) * trade.quantity;
  } else {
    profitLoss = (trade.entryPrice - closePrice) * trade.quantity;
  }

  // Update wallet balance
  wallet.futuresWallet += trade.marginUsed + profitLoss;
  await wallet.save();

  // Close the trade and store PNL information
  trade.status = "closed";
  trade.closedAt = new Date();
  trade.profitLoss = profitLoss;
  trade.closePrice = closePrice;
  await trade.save();

  res.status(200).json({
    message: "Futures position closed successfully",
    profitLoss,
    tradeId,
  });
});

export const getOpenPositions = catchAsyncErrors(async (req, res) => {
  try {
    const userId = req.user._id;
    const openTrades = await FuturesTrade.find({ userId, status: "open" });

    res.status(200).json({ trades: openTrades });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getFuturesTradeHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const trades = await FuturesTrade.find({
      userId,
      status: { $in: ["closed", "liquidated"] },
    });
    console.log(
      "got a history request and this is a futures complete object: " + trades
    );

    res.status(200).json({ message: "Trades fetched successfully", trades });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trades", error });
  }
};

export const getFundingRates = catchAsyncErrors(async (req, res) => {
  const rates = await FundingRate.find();
  res.status(200).json({ rates });
});

export const checkLiquidations = async (marketPrices) => {
  const futureTrades = await FuturesTrade.find({ status: "open" });
  const perpetualTrades = await PerpetualTrade.find({ status: "open" });
  const openTrades = [...futureTrades, ...perpetualTrades];
  for (const trade of openTrades) {
    const marketPrice = marketPrices[trade.pair];

    if (
      (trade.type === "long" && marketPrice <= trade.liquidationPrice) ||
      (trade.type === "short" && marketPrice >= trade.liquidationPrice)
    ) {
      // Calculate profit/loss for the liquidated trade (always negative)
      const profitLoss = -trade.marginUsed; // Full loss of margin

      // Liquidate the trade
      const wallet = await Wallet.findOne({ userId: trade.userId });
      if (wallet) {
        wallet.balanceUSDT -= trade.marginUsed;
        await wallet.save();
      }

      trade.status = "liquidated";
      trade.closedAt = new Date();
      trade.profitLoss = profitLoss;
      trade.closePrice = marketPrice;
      await trade.save();
      io.emit("liquidationUpdate", trade);
    }
  }
};

// Check for expired trades and close them
export const checkExpiredTrades = async () => {
  try {
    const now = new Date();

    // Find all open futures trades that have expired but don't have expired flag
    const expiredTrades = await FuturesTrade.find({
      status: "open",
      expiryTime: { $lte: now },
      isExpired: { $ne: true }, // Only get trades that aren't already marked as expired
    });

    for (const trade of expiredTrades) {
      // Get current market price for PNL calculation
      try {
        // Fetch current price from Binance API
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${trade.pair}`
        );
        const currentPrice = parseFloat(response.data.price);

        // Calculate PNL
        let profitLoss;
        if (trade.type === "long") {
          profitLoss = (currentPrice - trade.entryPrice) * trade.quantity;
        } else {
          profitLoss = (trade.entryPrice - currentPrice) * trade.quantity;
        }

        // Update wallet with PNL
        const wallet = await Wallet.findOne({ userId: trade.userId });
        if (wallet) {
          wallet.futuresWallet += trade.marginUsed + profitLoss;
          await wallet.save();
        }

        // Update the trade to mark it as closed with PNL data
        trade.isExpired = true;
        trade.status = "closed";
        trade.closedAt = now;
        trade.profitLoss = profitLoss;
        trade.closePrice = currentPrice;
        await trade.save();
      } catch (error) {
        console.error("Error fetching price for expired trade:", error);
        // If we can't get the price, just mark as expired without PNL calculation
        trade.isExpired = true;
        await trade.save();
      }

      // Notify clients about expired trade status
      io.emit("tradeExpired", trade);
    }

    console.log(`Checked and marked ${expiredTrades.length} trades as expired`);
  } catch (error) {
    console.error("Error checking expired trades:", error);
  }
};
