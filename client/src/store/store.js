import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './slices/marketSlice';
import tradeReducer from './slices/tradeSlice';
import financeReducer from './slices/financeSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    trade: tradeReducer,
    finance: financeReducer,
  },
});