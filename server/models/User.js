import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    phone: { type: String, unique: true },
    country: { type: String },
    profilePicture: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String }, // OTP for email/phone verification
    role: { type: String, enum: ["user", "admin"], default: "user" },
    balanceUSDT: { type: Number, default: 0 }, // Wallet balance in USDT
    balancePKR: { type: Number, default: 0 }, // PKR balance (if applicable)
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
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 14);
});

UserSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
export default mongoose.model("User", UserSchema);
