import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/all-users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching transactions
export const fetchRequests = createAsyncThunk(
  "admin/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/all-requests");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for approving a transaction
export const approveTransaction = createAsyncThunk(
  "admin/approveTransaction",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/approve/${requestId}`, null, );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for rejecting a transaction
export const rejectTransaction = createAsyncThunk(
  "admin/rejectTransaction",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/reject/${requestId}`, null, );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (tx) => tx._id !== action.meta.arg
        );
      })
      .addCase(approveTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (tx) => tx._id !== action.meta.arg
        );
      })
      .addCase(rejectTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
