import Transaction from "./models/Transaction"; // Ensure you import the Transaction model
import User from "../models/User";

export const fetchUsers = async(req, res, next) => {
    try{

        const users = await User.find();
        res.json({
          success: true,
          data: users,
        });
    } catch (error) {
        next(error); 
    }
};

export const fetchTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};
