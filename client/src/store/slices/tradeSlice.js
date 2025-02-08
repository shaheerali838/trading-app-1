import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    selectedCoin: null,
    chartData: [],
    recentTrades: [],
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
      });
  },
});

export const { setSelectedCoin, addTrade } = tradeSlice.actions;
export default tradeSlice.reducer;