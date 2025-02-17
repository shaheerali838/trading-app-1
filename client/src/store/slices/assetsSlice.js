import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../../utils/api";
import { setLoading } from "./globalSlice";

export const fundsRequest = createAsyncThunk(
  "funds/requeset",
  async (
    { amount, currency, accountName, accountNumber, type },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/funds/request", {
        amount,
        currency,
        type,
        accountName,
        accountNumber,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);
export const getWallet = createAsyncThunk(
  "user/wallet",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.get("/user/getwallet", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data; // Return object, NOT string
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

const assetsSlice = createSlice({
  name: "assets",
  initialState: {
    balance: 0,
    pendingTransactions: [],
    depositHistory: [],
    withdrawalHistory: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    addPendingTransaction: (state, action) => {
      state.pendingTransactions.push(action.payload);
    },
    removePendingTransaction: (state, action) => {
      state.pendingTransactions = state.pendingTransactions.filter(
        (tx) => tx.id !== action.payload
      );
    },
    addDepositHistory: (state, action) => {
      state.depositHistory.push(action.payload);
    },
    addWithdrawalHistory: (state, action) => {
      state.withdrawalHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fundsRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fundsRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance += action.payload.amount;
        state.depositHistory.push(action.payload);
        state.error = null;
      })
      .addCase(fundsRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to process deposit";
      })
      .addCase(getWallet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wallet = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch wallet data";
      });
  },
});

export const {
  updateBalance,
  addPendingTransaction,
  removePendingTransaction,
  addDepositHistory,
  addWithdrawalHistory,
} = assetsSlice.actions;

export default assetsSlice.reducer;
