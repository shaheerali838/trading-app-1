import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMarketData = createAsyncThunk(
  'market/fetchMarketData',
  async () => {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        sparkline: true
      }
    });
    return response.data;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    coins: [],
    status: 'idle',
    error: null,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = marketSlice.actions;
export default marketSlice.reducer;