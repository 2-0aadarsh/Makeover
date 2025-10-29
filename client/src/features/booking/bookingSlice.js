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
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  cancelError: null,
  rescheduleError: null,
  
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
      const response = await bookingApi.getUserBookings(params);
      return response;
    } catch (error) {
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
      return rejectWithValue(error.message);
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  'booking/rescheduleBooking',
  async ({ bookingId, newDate, newSlot }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.rescheduleBooking(bookingId, newDate, newSlot);
      return { bookingId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
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

export const fetchBookingStats = createAsyncThunk(
  'booking/fetchBookingStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingStats();
      return response;
    } catch (error) {
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload?.data?.bookings || action.payload?.bookings || [];
        state.pagination = action.payload?.data?.pagination || action.payload?.pagination || state.pagination;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
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

      // Fetch booking stats
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload?.data || action.payload || state.stats;
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
  resetBookingState
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

// Export reducer
export default bookingSlice.reducer;
