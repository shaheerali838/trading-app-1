import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api.js";
import { toast } from "react-toastify";

// Fetch Open Positions
export const fetchOpenPositions = createAsyncThunk(
  "futures/positions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/futures/positions");
      console.log('the open positions are: '+ JSON.stringify(response.data.trades));
      
      return response.data.trades;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Open a New Futures Trade
export const openFuturesTrade = createAsyncThunk(
  "futures/openTrade",
  async ({ pair, type, leverage, quantity, entryPrice }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/futures/open",
        { pair, type, leverage, quantity, entryPrice },
        { withCredentials: true }
      );
      toast.success("Trade Opened Successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to open trade");
      return rejectWithValue(error.response.data);
    }
  }
);

// Close a Trade
export const closeFuturesTrade = createAsyncThunk(
  "futures/closeTrade",
  async ({ tradeId }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/futures/close",
        { tradeId },
        { withCredentials: true }
      );
      toast.success("Trade Closed Successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close trade");
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  openPositions: [],
  status: "idle",
  error: null,
};

// Futures Slice
const futuresTradeSlice = createSlice({
  name: "futures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenPositions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOpenPositions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.openPositions = action.payload;
      })
      .addCase(fetchOpenPositions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(openFuturesTrade.pending, (state) => {
        state.status = "loading";
      })
      .addCase(openFuturesTrade.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.openPositions.push(action.payload);
      })
      .addCase(openFuturesTrade.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(closeFuturesTrade.pending, (state) => {
        state.status = "loading";
      })
      .addCase(closeFuturesTrade.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.openPositions = state.openPositions.filter(
          (trade) => trade._id !== action.payload.tradeId
        );
      })
      .addCase(closeFuturesTrade.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default futuresTradeSlice.reducer;
