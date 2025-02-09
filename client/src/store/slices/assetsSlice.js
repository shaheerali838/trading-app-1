import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const depositFunds = createAsyncThunk(
  "assets/deposit",
  async ({ amount, currency, method }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/transactions/deposit", {
        amount,
        currency,
        method,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  "assets/withdraw",
  async ({ amount, currency, method, address }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/transactions/withdraw", {
        amount,
        currency,
        method,
        address,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const assetsSlice = createSlice({
  name: "assets",
  initialState: {
    balance: 0,
    pendingTransactions: [],
    depositHistory: [],
    withdrawalHistory: [], // Add withdrawalHistory to the initial state
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
      .addCase(depositFunds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance += action.payload.amount;
        state.depositHistory.push(action.payload);
        state.error = null;
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to process deposit";
      })
      .addCase(withdrawFunds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance -= action.payload.amount;
        state.withdrawalHistory.push(action.payload); // Add withdrawal to history
        state.error = null;
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to process withdrawal";
      });
  },
});

export const {
  updateBalance,
  addPendingTransaction,
  removePendingTransaction,
  addDepositHistory,
  addWithdrawalHistory, // Export addWithdrawalHistory action
} = assetsSlice.actions;

export default assetsSlice.reducer;
