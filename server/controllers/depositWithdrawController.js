import DepositWithdrawRequest from "../models/RequestMessage.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

// Create a new deposit or withdrawal request
export const createDepositWithdrawRequest = async (req, res) => {
  try {
    const { type, amount, currency, accountNumber, accountName } = req.body;
    console.log(`the type is: ${type} and the user is ${req.user}`);
    
    
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
      accountNumber,
      accountName,
      status: "pending",
    });

    console.log(request);
    res.status(201).json({ message: `${type} request submitted`, request });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: "Error processing request", error });
  }
};

// Fetch user's deposit/withdrawal requests
export const getUserRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Fetch all deposit/withdrawal requests for admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await DepositWithdrawRequest.find({ status: "pending" }).populate("userId", "email").sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Approve deposit/withdrawal request
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await DepositWithdrawRequest.findById(requestId);
    
    if (!request || request.status !== "pending") {
      
      return res.status(400).json({ message: "Invalid request" });
    }

    const wallet = await Wallet.findOne({ userId: request.userId });
    
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (request.type === "deposit") {
      wallet[`balance${request.currency}`] += request.amount;
      wallet.depositHistory.push(requestId)
    } else if (request.type === "withdraw") {
      if (wallet[`balance${request.currency}`] < request.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      wallet[`balance${request.currency}`] -= request.amount;
      wallet.withdrawalHistory.push(requestId)
    }

    request.status = "approved";
    await request.save();
    await wallet.save();

    res.status(200).json({ message: `${request.type} request approved`, request });
  } catch (error) {
    res.status(500).json({ message: "Error approving request", error });
  }
};

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
  }
  catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}