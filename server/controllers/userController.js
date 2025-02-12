import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwtToken.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

/**
 * @desc Register a new user
 * @route POST /api/users/register
 */
export const register = catchAsyncErrors(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ success: false, msg: "User already exists" });
  }

  // Create new user
  user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await user.save();

  // Create a wallet for the user
  const wallet = new Wallet({ userId: user._id });
  await wallet.save();

  res.status(201).json({ success: true, msg: "User registered successfully" });
});

/**
 * @desc Login user & return JWT token
 * @route POST /api/users/login
 */
export const login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ success: false, msg: "Invalid credentials" });

  const isMatch = await user.comparePasswords(password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  // Generate JWT token
  const token = generateToken(user, "User logged in successfully", 200, res);

  res.json({ success: true, token, user });
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logout successfully",
    });
});
/**
 * @desc Get logged-in user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, country } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.country = country || user.country;

    await user.save();

    res.json({ success: true, msg: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};

/**
 * @desc Get user's wallet balance
 * @route GET /api/users/wallet
 * @access Private
 */
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet)
      return res.status(404).json({ success: false, msg: "Wallet not found" });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};

/**
 * @desc Request deposit (User uploads payment proof)
 * @route POST /api/users/deposit
 * @access Private
 */
export const requestDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const transaction = new Transaction({
      userId: req.user.userId,
      type: "deposit",
      amount,
      currency: "PKR",
      paymentMethod,
      proofOfPayment: req.file.path, // Image proof
      status: "pending",
    });

    await transaction.save();

    res.json({ success: true, msg: "Deposit request submitted", transaction });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};

/**
 * @desc Request withdrawal
 * @route POST /api/users/withdraw
 * @access Private
 */
export const requestWithdraw = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (wallet.balanceUSDT < amount) {
      return res
        .status(400)
        .json({ success: false, msg: "Insufficient balance" });
    }

    const transaction = new Transaction({
      userId: req.user.userId,
      type: "withdrawal",
      amount,
      currency: "USDT",
      paymentMethod,
      status: "pending",
    });

    await transaction.save();

    wallet.balanceUSDT -= amount;
    await wallet.save();

    res.json({
      success: true,
      msg: "Withdrawal request submitted",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};

/**
 * @desc Get transaction history
 * @route GET /api/users/transactions
 * @access Private
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", error });
  }
};
