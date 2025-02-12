const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderType: { type: String, enum: ["market", "limit"], required: true },
    asset: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number },
    status: { type: String, enum: ["pending", "executed", "canceled"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
