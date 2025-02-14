import DepositWithdrawRequest from "../models/RequestMessage.js";
import Wallet from "../models/Wallet.js";

// Create a new deposit or withdrawal request
export const createDepositWithdrawRequest = async (req, res) => {
  try {
    const { type, amount, currency } = req.body;
    
    if (!["deposit", "withdraw"].includes(type)) {
      return res.status(400).json({ msg: "Invalid transaction type" });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    if (type === "withdraw" && wallet[`balance${currency}`] < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    const request = await DepositWithdrawRequest.create({
      userId: req.user._id,
      type,
      amount,
      currency,
      status: "pending",
    });

    res.status(201).json({ msg: `${type} request submitted`, request });
  } catch (error) {
    res.status(500).json({ msg: "Error processing request", error });
  }
};

// Fetch user's deposit/withdrawal requests
export const getUserRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching requests", error });
  }
};

// Fetch all deposit/withdrawal requests for admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find().populate("userId", "email").sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching requests", error });
  }
};

// Approve deposit/withdrawal request
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await DepositWithdrawRequest.findById(requestId);
    
    if (!request || request.status !== "pending") {
      return res.status(400).json({ msg: "Invalid request" });
    }

    const wallet = await Wallet.findOne({ userId: request.userId });
    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    if (request.type === "deposit") {
      wallet[`balance${request.currency}`] += request.amount;
    } else if (request.type === "withdraw") {
      if (wallet[`balance${request.currency}`] < request.amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      wallet[`balance${request.currency}`] -= request.amount;
    }

    request.status = "approved";
    await request.save();
    await wallet.save();

    res.status(200).json({ msg: `${request.type} request approved`, request });
  } catch (error) {
    res.status(500).json({ msg: "Error approving request", error });
  }
};

// Reject deposit/withdrawal request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNote } = req.body;

    const request = await DepositWithdrawRequest.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ msg: "Invalid request" });
    }

    request.status = "rejected";
    request.adminNote = adminNote || "Request rejected by admin";
    await request.save();

    res.status(200).json({ msg: "Request rejected", request });
  } catch (error) {
    res.status(500).json({ msg: "Error rejecting request", error });
  }
};
