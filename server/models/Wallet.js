import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balanceUSDT: { type: Number, default: 0 },
    balancePKR: { type: Number, default: 0 },
    holdings: [
        {
          asset: String,  // e.g., BTC, ETH
          quantity: Number // User's holding amount
        }
      ],
    depositHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    withdrawalHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("Wallet", WalletSchema);
