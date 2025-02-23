import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { setLoading } from "./globalSlice";

// ✅ Open Perpetual Trade
export const openPerpetualTrade = createAsyncThunk(
  "perpetual/openTrade",
  async (tradeData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post("/perpetual/open", tradeData, {
        withCredentials: true,
      });
      toast.success("Perpetual trade opened successfully!");
      return response.data.trade;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to open trade");
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// ✅ Close Perpetual Trade
export const closePerpetualTrade = createAsyncThunk(
  "perpetual/closeTrade",
  async ({ tradeId, closePrice }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.post(
        "/perpetual/close",
        { tradeId, closePrice },
        { withCredentials: true }
      );
      toast.success("Perpetual trade closed successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close trade");
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);

// ✅ Get Open Positions
export const fetchOpenPerpetualTrades = createAsyncThunk(
  "perpetual/fetchOpenTrades",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await API.get("/perpetual/open-positions", {
        withCredentials: true,
      });
      console.log(response.data);

      return response.data.trades;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    } finally {
      dispatch(setLoading(false)); // Stop loading after request
    }
  }
);
const perpetualSlice = createSlice({
  name: "perpetual",
  initialState: {
    openTrades: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(openPerpetualTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openPerpetualTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades.push(action.payload);
      })
      .addCase(openPerpetualTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to open trade";
      })
      .addCase(closePerpetualTrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(closePerpetualTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades = state.openTrades.filter(
          (trade) => trade._id !== action.payload.tradeId
        );
      })
      .addCase(closePerpetualTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to close trade";
      })
      .addCase(fetchOpenPerpetualTrades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOpenPerpetualTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.openTrades = action.payload;
      })
      .addCase(fetchOpenPerpetualTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch trades";
      });
  },
});

export default perpetualSlice.reducer;
