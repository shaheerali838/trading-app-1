import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './slices/marketSlice';
import tradeReducer from './slices/tradeSlice';
import financeReducer from './slices/financeSlice';
import assetsReducer from './slices/assetsSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';

import globalReducer from './slices/globalSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    market: marketReducer,
    trade: tradeReducer,
    finance: financeReducer,
    assets: assetsReducer,
    admin: adminReducer,
    global: globalReducer,
  },
});

export default store;