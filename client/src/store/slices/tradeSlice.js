import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../utils/api';

export const fetchCoinData = createAsyncThunk(
  'trade/fetchCoinData',
  async (coinId) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: '1',
        interval: 'hourly'
      }
    });
    return response.data;
  }
);
export const placeOrder = createAsyncThunk(
  "trade/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await API.post("/trade/placeOrder", orderData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    selectedCoin: null,
    chartData: [],
    recentTrades: [],
    trades: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedCoin: (state, action) => {
      state.selectedCoin = action.payload;
    },
    addTrade: (state, action) => {
      state.recentTrades.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoinData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chartData = action.payload.prices;
      })
      .addCase(fetchCoinData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trades.push(action.payload.trade);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedCoin, addTrade } = tradeSlice.actions;
export default tradeSlice.reducer;