import Wallet from "../models/Wallet.js";
import FuturesTrade from "../models/FuturesTrade.js";
import FundingRate from "../models/FundingRate.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import PerpetualTrade from "../models/PerpetualTrade.js";
import { io } from "../server.js"; // Import WebSocket instance


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
    status: "open",
  });

  // Emit event for real-time updates
  io.emit("newFuturesTrade", futuresTrade);

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

  // Close the trade
  trade.status = "closed";
  trade.closedAt = new Date();
  await trade.save();

  res.status(200).json({
    message: "Futures position closed successfully",
    profitLoss,
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
      // Liquidate the trade
      const wallet = await Wallet.findOne({ userId: trade.userId });
      if (wallet) {
        wallet.balanceUSDT -= trade.marginUsed;
        await wallet.save();
      }

      trade.status = "liquidated";
      trade.closedAt = new Date();
      await trade.save();
      io.emit("liquidationUpdate", trade);
    }
  }
};
