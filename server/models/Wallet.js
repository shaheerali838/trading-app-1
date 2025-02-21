import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balanceUSDT: { type: Number, default: 0 },
  balanceETH: { type: Number, default: 0 },
  balanceBTC: { type: Number, default: 0 },
  balanceUSDC: { type: Number, default: 0 },
  marginBalance: { type: Number, default: 0 },
  holdings: [
    {
      asset: String, // e.g., BTC, ETH
      quantity: Number, // User's holding amount
    },
  ],
  depositHistory: [{ amount: Number, currency: String, createdAt: Date }],
  withdrawalHistory: [{ amount: Number, currency: String, createdAt: Date }],
  futuresPositions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FuturesTrade" },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Wallet", WalletSchema);
