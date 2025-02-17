import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,  // Centralized loading state
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = globalSlice.actions;
export default globalSlice.reducer;
