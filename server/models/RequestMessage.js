import mongoose from "mongoose";

const depositWithdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["deposit", "withdraw"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["USDT", "PKR"], required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String }, // Optional: Admin can add a reason for rejection
  },
  { timestamps: true }
);

const DepositWithdrawRequest = mongoose.model(
  "DepositWithdrawRequest",
  depositWithdrawSchema
);
export default DepositWithdrawRequest;
