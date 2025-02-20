import DepositWithdrawRequest from "../models/RequestMessage.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

// Create a new deposit or withdrawal request
export const createDepositWithdrawRequest = async (req, res) => {
  try {
    const { type, amount, currency, walletAddress } = req.body;

    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (type === "withdraw" && wallet[`balance${currency}`] < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const request = await DepositWithdrawRequest.create({
      userId: req.user._id,
      type,
      amount,
      currency,
      walletAddress,
      status: "pending",
    });

    res.status(201).json({ message: `${type} request submitted`, request });
  } catch (error) {

    res.status(500).json({ message: "Error processing request", error });
  }
};

// Fetch user's deposit/withdrawal requests
export const getUserRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Fetch all deposit/withdrawal requests for admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({ status: "pending" })
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

export const addTokens = async (req, res) => {
  try {
    const { currency, amount, userId } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const numericAmount = Number(amount);

    switch (currency) {
      case "USDT":
        wallet.balanceUSDT += numericAmount;
        break;
      case "ETH":
        wallet.balanceETH += numericAmount;
        break;
      case "BTC":
        wallet.balanceBTC += numericAmount;
        break;
      case "USDC":
        wallet.balanceUSDC += numericAmount;
        break;
      default:
        return res.status(400).json({ message: "Invalid currency type" });
    }

    wallet.depositHistory.push({ currency, amount, createdAt: new Date() });

    await wallet.save();

    res.status(200).json({ message: `Tokens added successfully`, wallet });
  } catch (error) {
    res.status(500).json({ message: "Error adding tokens", error });
  }
};

export const approveWithDrawRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    console.log('the reqID is ' + requestId);
    

    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request) {
      return res.status(404).send({ message: "Request not found" });
    }

    const user = await User.findOne({ _id: request.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const wallet = await Wallet.findOne({ userId: request.userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet[`balance${request.currency}`] < request.amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet[`balance${request.currency}`] -= request.amount;
    wallet.withdrawalHistory.push({
      amount: request.amount,
      currency: request.currency,
      createdAt: new Date(),
    });

    request.status = "approved";
    await request.save();
    await wallet.save();

    res.status(200).json({ message: `${request.type} request approved`, request });
  } catch (error) {
    res.status(500).json({ message: "Error approving withdraw request", error });
  }
};

export const changeWithdrawRequeststatus = async(req, res) => {
  try {
    const { requestId } = req.params;
    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    await request.save();
    res.status(200).json({ message: "Request status changed to approved", request });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Reject deposit/withdrawal request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNote } = req.body;

    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    request.status = "rejected";
    request.adminNote = adminNote || "Request rejected by admin";
    await request.save();

    res.status(200).json({ message: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
