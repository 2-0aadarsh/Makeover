import { createSlice } from '@reduxjs/toolkit';
import { fetchAllBookings, fetchBookingById, updateBookingStatus } from './adminBookingsThunks';

const initialState = {
  bookings: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  },
  loading: false,
  error: null,
  // Booking details state
  bookingDetails: null,
  detailsLoading: false,
  detailsError: null,
  statusUpdateLoading: false,
  statusUpdateError: null,
  // Search and filter state
  searchQuery: '',
  statusFilter: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const adminBookingsSlice = createSlice({
  name: 'adminBookings',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.statusFilter = '';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.bookings = action.payload.data.bookings || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalBookings: action.payload.data.pagination.totalBookings || 0,
              limit: action.payload.data.pagination.limit || 8,
              hasNextPage: action.payload.data.pagination.hasNextPage || false,
              hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
            };
          }
          if (action.payload.data.filters) {
            state.filters = action.payload.data.filters;
          }
        }
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch Booking Details
      .addCase(fetchBookingById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;
        if (action.payload?.data) {
          state.bookingDetails = action.payload.data;
        }
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || action.error.message;
        state.bookingDetails = null;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = null;
        if (action.payload?.data && state.bookingDetails?.id === action.payload.data.id) {
          state.bookingDetails.status = action.payload.data.status;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload || action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  setPage,
  resetFilters,
} = adminBookingsSlice.actions;

export default adminBookingsSlice.reducer;
