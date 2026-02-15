import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPaymentOrder,
  verifyPayment,
  createCODOrder,
  getPaymentHistory,
  getPaymentDetails,
  cancelPaymentOrder,
  getPaymentStats
} from './paymentApi';

// Async thunks
export const createPaymentOrderAsync = createAsyncThunk(
  'payment/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createPaymentOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPaymentAsync = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await verifyPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCODOrderAsync = createAsyncThunk(
  'payment/createCOD',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createCODOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentHistoryAsync = createAsyncThunk(
  'payment/getHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPaymentHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentDetailsAsync = createAsyncThunk(
  'payment/getDetails',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await getPaymentDetails(paymentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelPaymentOrderAsync = createAsyncThunk(
  'payment/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cancelPaymentOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPaymentStatsAsync = createAsyncThunk(
  'payment/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Payment order creation
  paymentOrder: null,
  paymentOrderLoading: false,
  paymentOrderError: null,

  // Payment verification
  paymentVerification: null,
  verificationLoading: false,
  verificationError: null,

  // COD order creation
  codOrder: null,
  codOrderLoading: false,
  codOrderError: null,

  // Payment history
  paymentHistory: [],
  historyLoading: false,
  historyError: null,
  historyPagination: {
    current: 1,
    pages: 0,
    total: 0,
    limit: 10
  },

  // Payment details
  paymentDetails: null,
  detailsLoading: false,
  detailsError: null,

  // Payment statistics
  paymentStats: [],
  statsLoading: false,
  statsError: null,

  // Razorpay integration state
  razorpayLoaded: false,
  razorpayError: null,

  // Current payment flow
  currentPayment: {
    orderId: null,
    amount: 0,
    currency: 'INR',
    status: 'idle', // idle, loading, success, failed
    method: null, // 'online' or 'cod'
    error: null
  },

  // Order tracking
  currentOrder: null,
  orderLoading: false,
  orderError: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Clear payment errors
    clearPaymentErrors: (state) => {
      state.paymentOrderError = null;
      state.verificationError = null;
      state.codOrderError = null;
      state.historyError = null;
      state.detailsError = null;
      state.statsError = null;
      state.orderError = null;
    },

    // Clear payment data
    clearPaymentData: (state) => {
      state.paymentOrder = null;
      state.paymentVerification = null;
      state.codOrder = null;
      state.currentPayment = {
        orderId: null,
        amount: 0,
        currency: 'INR',
        status: 'idle',
        method: null,
        error: null
      };
      state.currentOrder = null;
    },

    // Set Razorpay loaded state
    setRazorpayLoaded: (state, action) => {
      state.razorpayLoaded = action.payload;
    },

    // Set Razorpay error
    setRazorpayError: (state, action) => {
      state.razorpayError = action.payload;
    },

    // Set current payment
    setCurrentPayment: (state, action) => {
      state.currentPayment = {
        ...state.currentPayment,
        ...action.payload
      };
    },

    // Reset current payment
    resetCurrentPayment: (state) => {
      state.currentPayment = {
        orderId: null,
        amount: 0,
        currency: 'INR',
        status: 'idle',
        method: null,
        error: null
      };
    },

    // Set current order
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Order
      .addCase(createPaymentOrderAsync.pending, (state) => {
        state.paymentOrderLoading = true;
        state.paymentOrderError = null;
        state.currentPayment.status = 'loading';
      })
      .addCase(createPaymentOrderAsync.fulfilled, (state, action) => {
        console.log('Payment order fulfilled - payload:', action.payload);
        state.paymentOrderLoading = false;
        
        // Safety check for payload structure
        if (!action.payload || !action.payload.data) {
          console.error('Invalid payload structure:', action.payload);
          state.paymentOrderError = 'Invalid response from server';
          state.currentPayment.status = 'failed';
          state.currentPayment.error = 'Invalid response from server';
          return;
        }
        
        state.paymentOrder = action.payload.data;
        state.currentPayment = {
          ...state.currentPayment,
          orderId: action.payload.data.orderId,
          amount: action.payload.data.amount,
          currency: action.payload.data.currency,
          status: 'created',
          method: 'online',
          error: null
        };
      })
      .addCase(createPaymentOrderAsync.rejected, (state, action) => {
        console.log('Payment order rejected - payload:', action.payload);
        console.log('Payment order rejected - error:', action.error);
        state.paymentOrderLoading = false;
        state.paymentOrderError = action.payload;
        state.currentPayment.status = 'failed';
        state.currentPayment.error = action.payload;
      })

      // Verify Payment
      .addCase(verifyPaymentAsync.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
        state.currentPayment.status = 'loading';
      })
      .addCase(verifyPaymentAsync.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.paymentVerification = action.payload.data;
        state.currentPayment.status = 'success';
        state.currentOrder = action.payload.data;
      })
      .addCase(verifyPaymentAsync.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload;
        state.currentPayment.status = 'failed';
        state.currentPayment.error = action.payload;
      })

      // Create COD Order
      .addCase(createCODOrderAsync.pending, (state) => {
        state.codOrderLoading = true;
        state.codOrderError = null;
        state.currentPayment.status = 'loading';
      })
      .addCase(createCODOrderAsync.fulfilled, (state, action) => {
        state.codOrderLoading = false;
        state.codOrder = action.payload.data;
        state.currentPayment.status = 'success';
        state.currentPayment.method = 'cod';
        state.currentOrder = action.payload.data;
      })
      .addCase(createCODOrderAsync.rejected, (state, action) => {
        state.codOrderLoading = false;
        state.codOrderError = action.payload;
        state.currentPayment.status = 'failed';
        state.currentPayment.error = action.payload;
      })

      // Get Payment History
      .addCase(getPaymentHistoryAsync.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getPaymentHistoryAsync.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.paymentHistory = action.payload.data.payments;
        state.historyPagination = action.payload.data.pagination;
      })
      .addCase(getPaymentHistoryAsync.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      // Get Payment Details
      .addCase(getPaymentDetailsAsync.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getPaymentDetailsAsync.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.paymentDetails = action.payload.data;
      })
      .addCase(getPaymentDetailsAsync.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      })

      // Cancel Payment Order
      .addCase(cancelPaymentOrderAsync.pending, (state) => {
        state.currentPayment.status = 'loading';
      })
      .addCase(cancelPaymentOrderAsync.fulfilled, (state) => {
        state.currentPayment.status = 'cancelled';
        state.currentPayment.orderId = null;
      })
      .addCase(cancelPaymentOrderAsync.rejected, (state, action) => {
        state.currentPayment.status = 'failed';
        state.currentPayment.error = action.payload;
      })

      // Get Payment Stats
      .addCase(getPaymentStatsAsync.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(getPaymentStatsAsync.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.paymentStats = action.payload.data;
      })
      .addCase(getPaymentStatsAsync.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  }
});

export const {
  clearPaymentErrors,
  clearPaymentData,
  setRazorpayLoaded,
  setRazorpayError,
  setCurrentPayment,
  resetCurrentPayment,
  setCurrentOrder,
  clearCurrentOrder
} = paymentSlice.actions;

export default paymentSlice.reducer;
