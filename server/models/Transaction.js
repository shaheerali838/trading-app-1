import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["PKR", "USDT"], required: true },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Easypaisa", "JazzCash"],
      required: true,
    },
    transactionId: { type: String, unique: true },
    proofOfPayment: { type: String }, // Image URL for deposit proof
    adminApproval: { type: Boolean, default: false }, // Admin must approve manual deposits
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("Transaction", TransactionSchema);
