import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../../utils/api";
import { setLoading } from "./globalSlice";

export const fundsRequest = createAsyncThunk(
  "funds/request",
  async (
    { amount, currency, network, walletAddress, type },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/funds/request", {
        amount,
        currency,
        network,
        type,
        walletAddress,
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

export const swapAssets = createAsyncThunk(
  "wallet/swapAssets",
  async (
    { fromAsset, toAsset, amount, exchangeRate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/user/swap", {
        fromAsset,
        toAsset,
        amount,
        exchangeRate,
      });
      console.log(response.data.message);

      toast.success(response.data.message || "Swap successful");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

export const fetchExchangeRate = createAsyncThunk(
  "wallet/fetchExchangeRate",
  async ({ fromAsset, toAsset }, { rejectWithValue }) => {
    try {
      // Validate inputs
      if (!fromAsset || !toAsset) {
        toast.error("Invalid currency pair");
        return rejectWithValue({ message: "Invalid currency pair" });
      }

      console.log("Fetching exchange rate:", fromAsset, "to", toAsset);

      // Make the API request to CryptoCompare
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price`,
        {
          params: {
            fsym: fromAsset.toUpperCase(), // Convert from (e.g., BTC)
            tsyms: toAsset.toUpperCase(), // Convert to (e.g., ETH)
          },
        }
      );

      // Extract the exchange rate from the response
      const exchangeRate = response.data[toAsset.toUpperCase()];

      if (!exchangeRate) {
        toast.error("Invalid currency pair or no data available");
        return rejectWithValue({ message: "Invalid currency pair or no data available" });
      }

      console.log("Exchange rate fetched:", exchangeRate);
      return exchangeRate;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      toast.error(
        error.response?.data?.Message || "Failed to fetch exchange rate"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

// Transfer Funds Async Thunk
export const transferFunds = createAsyncThunk(
  "assets/transferFunds",
  async ({ fromWallet, toWallet, amount }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/wallet/transfer", {
        fromWallet,
        toWallet,
        amount,
      });
      toast.success(response?.data?.message || "Transfer successful");
      return response.data;
    } catch (error) {
      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message || "Transfer failed");
      return rejectWithValue(
        error.response?.data?.message || "Transfer failed"
      );
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
    exchangeRate: null, // Add exchangeRate to the initial state
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
      })
      .addCase(fetchExchangeRate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.exchangeRate = action.payload;
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch exchange rate";
      })

      // Transfer Funds Cases
      .addCase(transferFunds.pending, (state) => {
        state.transferStatus = "loading";
      })
      .addCase(transferFunds.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
      })
      .addCase(transferFunds.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
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
