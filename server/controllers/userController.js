import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwtToken.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
/**
 * @desc Register a new user
 * @route POST /api/users/register
 */
export const register = catchAsyncErrors(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  const userRole = role || "user";
  // Create new user
  user = new User({
    firstName,
    lastName,
    email,
    password,
    role: userRole,
  });

  await user.save();

  // Create a wallet for the user
  const wallet = new Wallet({ userId: user._id });
  await wallet.save();
  generateToken(user, "User logged in successfully", 200, res);
});

/**
 * @desc Login user & return JWT token
 * @route POST /api/users/login
 */
export const login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });

  const isMatch = await user.comparePasswords(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT token
  const token = generateToken(user, "User logged in successfully", 200, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      httpOnly: true,
      secure: true,
      samesite: "None",
      path: "/",
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "User Logout successfully",
    });
});
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      secure: true,
      samesite: "None",
      path: "/",
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Admin Logout successfully",
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.country = country || user.country;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

/**
 * @desc Get user's wallet balance
 * @route GET /api/users/wallet
 * @access Private
 */
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id })
      .populate("withdrawalHistory")
      .populate("depositHistory")
      .exec();

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet data", error });
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

    res.json({
      success: true,
      message: "Deposit request submitted",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
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
        .json({ success: false, message: "Insufficient balance" });
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
      message: "Withdrawal request submitted",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
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
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const swapCrypto = async (req, res) => {
  try {
    const { fromAsset, toAsset, amount, exchangeRate } = req.body;
    console.log(
      `got a swap request with data in the body:\n from: ${fromAsset} to: ${toAsset} and amount in the body: ${amount} and the exchange rate: ${exchangeRate}`
    );

    const userId = req.user._id;
    console.log("User ID:", userId); // Log the user ID

    if (!fromAsset || !toAsset || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!exchangeRate) {
      console.log("Exchange rate not found");
      return res.status(400).json({ message: "Invalid currency pair" });
    }

    const toAmount = amount * exchangeRate; // Calculate amount to receive

    // Fetch user's wallet
    const userWallet = await Wallet.findOne({ userId });
    if (!userWallet) {
      console.log("Wallet not found for user ID:", userId);
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Access balance fields directly
    const fromBalance = userWallet[`balance${fromAsset}`];
    const toBalance = userWallet[`balance${toAsset}`] || 0;

    console.log(`User's ${fromAsset} balance:`, fromBalance);
    console.log(`User's ${toAsset} balance:`, toBalance);

    if (fromBalance < amount) {
      console.log("Insufficient balance");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct 'fromAsset' balance and add 'toAsset' balance
    userWallet[`balance${fromAsset}`] -= amount;
    userWallet[`balance${toAsset}`] = toBalance + toAmount;

    await userWallet.save();

    // Save transaction details
    const transaction = new Transaction({
      userId,
      type: "swap",
      fromAsset,
      toAsset,
      fromAmount: amount,
      toAmount,
      exchangeRate,
      status: "completed",
      transactionId: uuidv4(),
      timestamp: new Date(),
    });
    await transaction.save();

    return res
      .status(200)
      .json({ message: "Swap successful", fromAmount: amount, toAmount });
  } catch (error) {
    console.error("Swap Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
