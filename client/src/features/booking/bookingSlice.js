import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from './bookingApi.js';

// Initial state
const initialState = {
  // Bookings data
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  
  // Loading states
  loading: false,
  creating: false,
  updating: false,
  cancelling: false,
  rescheduling: false,
  completingPayment: false,
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  cancelError: null,
  rescheduleError: null,
  paymentError: null,
  
  // Pagination and filters
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    status: 'all',
    dateFrom: null,
    dateTo: null,
    service: '',
    searchQuery: ''
  },
  
  // Statistics
  stats: {
    totalBookings: 0,
    totalSpent: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    upcomingBookings: 0,
    statusBreakdown: {}
  },
  
  // Available slots
  availableSlots: [],
  slotsLoading: false,
  slotsError: null,
  
  // Booking configuration
  bookingConfig: {
    minimumOrderValue: null,
    currency: 'INR',
    loading: false,
    error: null,
    lastFetched: null
  },
  
  // Last action timestamps
  lastFetched: null,
  lastCreated: null,
  lastUpdated: null
};

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("🚀 fetchUserBookings thunk - Starting API call with params:", params);
      const response = await bookingApi.getUserBookings(params);
      console.log("✅ fetchUserBookings thunk - API response received:", response);
      console.log("📦 Response structure:", {
        hasData: !!response?.data,
        hasBookings: !!response?.data?.bookings,
        bookingsIsArray: Array.isArray(response?.data?.bookings),
        bookingsLength: response?.data?.bookings?.length,
        fullResponse: response
      });
      return response;
    } catch (error) {
      console.error("❌ fetchUserBookings thunk - Error caught:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingById(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.createBooking(bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancelBooking(bookingId, cancellationReason);
      return { bookingId, ...response };
    } catch (error) {
      const errorPayload = error.response?.data || { message: error.message };
      return rejectWithValue(errorPayload);
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  'booking/rescheduleBooking',
  async ({ bookingId, newDate, newSlot, newPaymentMethod, reason }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux Thunk: Reschedule booking initiated:', {
        bookingId,
        newDate,
        newSlot,
        newPaymentMethod: newPaymentMethod || 'not provided',
        reason: reason || 'not provided'
      });
      
      // Prepare reschedule data
      const rescheduleData = {
        newDate,
        newSlot
      };
      
      // Add optional fields if provided
      if (newPaymentMethod) {
        rescheduleData.newPaymentMethod = newPaymentMethod;
      }
      
      if (reason) {
        rescheduleData.reason = reason;
      }
      
      console.log('📦 Reschedule data prepared:', rescheduleData);
      
      const response = await bookingApi.rescheduleBooking(bookingId, rescheduleData);
      
      console.log('✅ Redux Thunk: Reschedule successful:', {
        bookingId,
        rescheduleCount: response.rescheduleCount,
        remainingReschedules: response.remainingReschedules
      });
      
      return { bookingId, ...response };
    } catch (error) {
      console.error('❌ Redux Thunk: Reschedule failed:', error);
      
      // Extract full error payload from backend
      const errorPayload = error.response?.data || { 
        message: error.message,
        error: 'UNKNOWN_ERROR'
      };
      
      console.error('❌ Error payload:', errorPayload);
      
      return rejectWithValue(errorPayload);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'booking/updatePaymentStatus',
  async ({ bookingId, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.updatePaymentStatus(bookingId, { paymentStatus });
      return { bookingId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeBookingPayment = createAsyncThunk(
  'booking/completeBookingPayment',
  async ({ bookingId, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature }, { rejectWithValue }) => {
    try {
      console.log('💳 Redux Thunk: Complete booking payment initiated:', {
        bookingId,
        paymentMethod,
        hasRazorpayData: !!(razorpayOrderId && razorpayPaymentId && razorpaySignature)
      });
      
      // Prepare payment data
      const paymentData = {
        paymentMethod
      };
      
      // Add Razorpay data if provided (for online payments)
      if (paymentMethod === 'online' && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
        paymentData.razorpayOrderId = razorpayOrderId;
        paymentData.razorpayPaymentId = razorpayPaymentId;
        paymentData.razorpaySignature = razorpaySignature;
      }
      
      console.log('📦 Payment data prepared:', {
        ...paymentData,
        razorpaySignature: paymentData.razorpaySignature ? '[REDACTED]' : undefined
      });
      
      const response = await bookingApi.completeBookingPayment(bookingId, paymentData);
      
      console.log('✅ Redux Thunk: Payment completion successful:', {
        bookingId,
        orderNumber: response.data?.orderNumber,
        paymentStatus: response.data?.paymentStatus,
        paymentMethod: response.data?.paymentDetails?.paymentMethod
      });
      
      return { bookingId, ...response };
    } catch (error) {
      console.error('❌ Redux Thunk: Payment completion failed:', error);
      
      // Extract full error payload from backend
      const errorPayload = error.response?.data || { 
        message: error.message,
        error: 'UNKNOWN_ERROR'
      };
      
      console.error('❌ Error payload:', errorPayload);
      
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchBookingStats = createAsyncThunk(
  'booking/fetchBookingStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 fetchBookingStats thunk - Starting API call...');
      const response = await bookingApi.getBookingStats();
      console.log('✅ fetchBookingStats thunk - API response received:', response);
      console.log('📊 Stats data:', response?.data);
      return response;
    } catch (error) {
      console.error('❌ fetchBookingStats thunk - Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUpcomingBookings = createAsyncThunk(
  'booking/fetchUpcomingBookings',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getUpcomingBookings(limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchBookings = createAsyncThunk(
  'booking/searchBookings',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.searchBookings(query, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'booking/fetchAvailableSlots',
  async (date, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getAvailableSlots(date);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMinimumOrderValue = createAsyncThunk(
  'booking/fetchMinimumOrderValue',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 fetchMinimumOrderValue thunk - Starting API call...');
      const response = await bookingApi.getMinimumOrderValue();
      console.log('✅ fetchMinimumOrderValue thunk - API response:', response);
      return response;
    } catch (error) {
      console.error('❌ fetchMinimumOrderValue thunk - Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.cancelError = null;
      state.rescheduleError = null;
      state.slotsError = null;
    },

    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        dateFrom: null,
        dateTo: null,
        service: '',
        searchQuery: ''
      };
    },

    // Set pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Update booking in list (optimistic updates)
    updateBookingInList: (state, action) => {
      const { bookingId, updates } = action.payload;
      const index = state.bookings.findIndex(booking => booking._id === bookingId);
      if (index !== -1) {
        state.bookings[index] = { ...state.bookings[index], ...updates };
      }
      
      // Update current booking if it's the same
      if (state.currentBooking && state.currentBooking._id === bookingId) {
        state.currentBooking = { ...state.currentBooking, ...updates };
      }
    },

    // Add booking to list (for new bookings)
    addBookingToList: (state, action) => {
      state.bookings.unshift(action.payload);
    },

    // Remove booking from list (for cancelled bookings)
    removeBookingFromList: (state, action) => {
      state.bookings = state.bookings.filter(
        booking => booking._id !== action.payload
      );
    },

    // Reset state
    resetBookingState: (state) => {
      return { ...initialState };
    },

    // Initialize bookingConfig if missing (for Redux Persist compatibility)
    initializeBookingConfig: (state) => {
      if (!state.bookingConfig) {
        state.bookingConfig = {
          minimumOrderValue: null,
          currency: 'INR',
          loading: false,
          error: null,
          lastFetched: null
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        console.log("🔍 fetchUserBookings.fulfilled - Full action:", action);
        console.log("🔍 fetchUserBookings.fulfilled - Payload:", action.payload);
        console.log("🔍 fetchUserBookings.fulfilled - Payload.data:", action.payload?.data);
        console.log("🔍 fetchUserBookings.fulfilled - Bookings:", action.payload?.data?.bookings || action.payload?.bookings);
        
        state.loading = false;
        state.bookings = action.payload?.data?.bookings || action.payload?.bookings || [];
        state.pagination = action.payload?.data?.pagination || action.payload?.pagination || state.pagination;
        state.lastFetched = new Date().toISOString();
        
        console.log("✅ State updated - bookings count:", state.bookings.length);
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        console.error("❌ fetchUserBookings.rejected - Error:", action.payload);
        console.error("❌ fetchUserBookings.rejected - Full action:", action);
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload?.data || action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.bookings.unshift(action.payload?.data || action.payload);
        state.lastCreated = new Date().toISOString();
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.cancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelling = false;
        const { bookingId, data } = action.payload;
        
        // Update booking in list
        const index = state.bookings.findIndex(booking => booking._id === bookingId);
        if (index !== -1) {
          state.bookings[index] = data;
        }
        
        // Update current booking if it's the same
        if (state.currentBooking && state.currentBooking._id === bookingId) {
          state.currentBooking = data;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelling = false;
        state.cancelError = action.payload;
      })

      // Reschedule booking
      .addCase(rescheduleBooking.pending, (state) => {
        state.rescheduling = true;
        state.rescheduleError = null;
      })
      .addCase(rescheduleBooking.fulfilled, (state, action) => {
        state.rescheduling = false;
        const { bookingId, data } = action.payload;
        
        // Update booking in list
        const index = state.bookings.findIndex(booking => booking._id === bookingId);
        if (index !== -1) {
          state.bookings[index] = data;
        }
        
        // Update current booking if it's the same
        if (state.currentBooking && state.currentBooking._id === bookingId) {
          state.currentBooking = data;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(rescheduleBooking.rejected, (state, action) => {
        state.rescheduling = false;
        state.rescheduleError = action.payload;
      })

      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.updating = false;
        const { bookingId, data } = action.payload;
        
        // Update booking in list
        const index = state.bookings.findIndex(booking => booking._id === bookingId);
        if (index !== -1) {
          state.bookings[index] = data;
        }
        
        // Update current booking if it's the same
        if (state.currentBooking && state.currentBooking._id === bookingId) {
          state.currentBooking = data;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })

      // Complete booking payment
      .addCase(completeBookingPayment.pending, (state) => {
        state.completingPayment = true;
        state.paymentError = null;
      })
      .addCase(completeBookingPayment.fulfilled, (state, action) => {
        state.completingPayment = false;
        const { bookingId, data } = action.payload;
        
        console.log('✅ Payment completion fulfilled - updating state:', {
          bookingId,
          paymentStatus: data?.paymentStatus,
          paymentMethod: data?.paymentDetails?.paymentMethod
        });
        
        // Update booking in list
        const index = state.bookings.findIndex(booking => booking._id === bookingId);
        if (index !== -1) {
          state.bookings[index] = data;
        }
        
        // Update current booking if it's the same
        if (state.currentBooking && state.currentBooking._id === bookingId) {
          state.currentBooking = data;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(completeBookingPayment.rejected, (state, action) => {
        state.completingPayment = false;
        state.paymentError = action.payload;
        
        console.error('❌ Payment completion rejected - error stored:', action.payload);
      })

      // Fetch booking stats
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        console.log('🔍 fetchBookingStats.fulfilled - Full action:', action);
        console.log('🔍 fetchBookingStats.fulfilled - Payload:', action.payload);
        console.log('🔍 fetchBookingStats.fulfilled - Payload.data:', action.payload?.data);
        
        // Handle response structure: { success: true, data: { ...stats } }
        const statsData = action.payload?.data || action.payload;
        console.log('🔍 Stats data extracted:', statsData);
        
        if (statsData) {
          state.stats = {
            totalBookings: statsData.totalBookings ?? 0,
            totalSpent: statsData.totalSpent ?? 0,
            completedBookings: statsData.completedBookings ?? 0,
            cancelledBookings: statsData.cancelledBookings ?? 0,
            upcomingBookings: statsData.upcomingBookings ?? 0,
            statusBreakdown: statsData.statusBreakdown || {}
          };
          console.log('✅ State updated with stats:', state.stats);
        } else {
          console.warn('⚠️ No stats data found in payload');
        }
      })
      .addCase(fetchBookingStats.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch upcoming bookings
      .addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
        state.upcomingBookings = action.payload?.data || action.payload || [];
      })
      .addCase(fetchUpcomingBookings.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Search bookings
      .addCase(searchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload?.data?.bookings || action.payload?.bookings || [];
        state.pagination = action.payload?.data?.pagination || action.payload?.pagination || state.pagination;
      })
      .addCase(searchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.slotsLoading = true;
        state.slotsError = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.availableSlots = action.payload?.data?.availableSlots || action.payload?.availableSlots || [];
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.slotsLoading = false;
        state.slotsError = action.payload;
      })

      // Fetch minimum order value
      .addCase(fetchMinimumOrderValue.pending, (state) => {
        // Initialize bookingConfig if missing (Redux Persist compatibility)
        if (!state.bookingConfig) {
          state.bookingConfig = {
            minimumOrderValue: null,
            currency: 'INR',
            loading: false,
            error: null,
            lastFetched: null
          };
        }
        state.bookingConfig.loading = true;
        state.bookingConfig.error = null;
      })
      .addCase(fetchMinimumOrderValue.fulfilled, (state, action) => {
        console.log('🔍 fetchMinimumOrderValue.fulfilled - Payload:', action.payload);
        // Initialize bookingConfig if missing (Redux Persist compatibility)
        if (!state.bookingConfig) {
          state.bookingConfig = {
            minimumOrderValue: null,
            currency: 'INR',
            loading: false,
            error: null,
            lastFetched: null
          };
        }
        state.bookingConfig.loading = false;
        const configData = action.payload?.data;
        if (configData) {
          state.bookingConfig.minimumOrderValue = configData.value;
          state.bookingConfig.currency = configData.currency || 'INR';
          state.bookingConfig.lastFetched = new Date().toISOString();
          console.log('✅ MOV updated in state:', state.bookingConfig.minimumOrderValue);
        }
      })
      .addCase(fetchMinimumOrderValue.rejected, (state, action) => {
        console.error('❌ fetchMinimumOrderValue.rejected - Error:', action.payload);
        // Initialize bookingConfig if missing (Redux Persist compatibility)
        if (!state.bookingConfig) {
          state.bookingConfig = {
            minimumOrderValue: null,
            currency: 'INR',
            loading: false,
            error: null,
            lastFetched: null
          };
        }
        state.bookingConfig.loading = false;
        state.bookingConfig.error = action.payload;
        // Set default MOV on error (fail-safe)
        state.bookingConfig.minimumOrderValue = 999;
      });
  }
});

// Export actions
export const {
  clearErrors,
  clearCurrentBooking,
  setFilters,
  clearFilters,
  setPagination,
  updateBookingInList,
  addBookingToList,
  removeBookingFromList,
  resetBookingState,
  initializeBookingConfig
} = bookingSlice.actions;

// Export selectors
export const selectBookings = (state) => state.booking.bookings;
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectUpcomingBookings = (state) => state.booking.upcomingBookings;
export const selectBookingStats = (state) => state.booking.stats;
export const selectBookingFilters = (state) => state.booking.filters;
export const selectBookingPagination = (state) => state.booking.pagination;
export const selectAvailableSlots = (state) => state.booking.availableSlots;

export const selectBookingLoading = (state) => state.booking.loading;
export const selectBookingCreating = (state) => state.booking.creating;
export const selectBookingUpdating = (state) => state.booking.updating;
export const selectBookingCancelling = (state) => state.booking.cancelling;
export const selectBookingRescheduling = (state) => state.booking.rescheduling;
export const selectSlotsLoading = (state) => state.booking.slotsLoading;

export const selectBookingError = (state) => state.booking.error;
export const selectBookingCreateError = (state) => state.booking.createError;
export const selectBookingUpdateError = (state) => state.booking.updateError;
export const selectBookingCancelError = (state) => state.booking.cancelError;
export const selectBookingRescheduleError = (state) => state.booking.rescheduleError;
export const selectSlotsError = (state) => state.booking.slotsError;

// Booking config selectors (with safe access for Redux Persist compatibility)
export const selectMinimumOrderValue = (state) => 
  state.booking?.bookingConfig?.minimumOrderValue ?? null;
export const selectBookingConfig = (state) => 
  state.booking?.bookingConfig ?? {
    minimumOrderValue: null,
    currency: 'INR',
    loading: false,
    error: null,
    lastFetched: null
  };
export const selectMovLoading = (state) => 
  state.booking?.bookingConfig?.loading ?? false;

// Export reducer
export default bookingSlice.reducer;
