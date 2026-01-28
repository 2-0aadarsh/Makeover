import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboardMetrics,
  fetchTodayBookings,
  fetchRecentActivity,
  fetchDashboardStats,
} from './adminDashboardThunks';

const initialState = {
  // Metrics state
  metrics: {
    totalUsers: null,
    totalBookings: null,
    totalRevenue: null,
    upcomingBookings: null,
  },
  metricsLoading: false,
  metricsError: null,

  // Today's bookings state
  todayBookings: [],
  bookingsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  bookingsLoading: false,
  bookingsError: null,

  // Recent activity state
  recentActivity: {
    recentBookings: [],
    recentEnquiries: [],
    recentUsers: [],
  },
  activityLoading: false,
  activityError: null,

  // Dashboard stats state
  stats: {
    bookingStatusBreakdown: [],
    paymentStatusBreakdown: [],
    monthlyRevenue: [],
  },
  statsLoading: false,
  statsError: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    // Reset state
    resetDashboardState: (state) => {
      return initialState;
    },
    // Set current page for bookings
    setBookingsPage: (state, action) => {
      state.bookingsPagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.metricsError = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metricsError = null;
        if (action.payload?.data) {
          state.metrics = action.payload.data;
        }
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.metricsError = action.payload || action.error.message;
      })

      // Fetch Today's Bookings
      .addCase(fetchTodayBookings.pending, (state) => {
        state.bookingsLoading = true;
        state.bookingsError = null;
      })
      .addCase(fetchTodayBookings.fulfilled, (state, action) => {
        state.bookingsLoading = false;
        state.bookingsError = null;
        if (action.payload?.data) {
          state.todayBookings = action.payload.data.bookings || [];
          if (action.payload.data.pagination) {
            state.bookingsPagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalBookings: action.payload.data.pagination.totalBookings || 0,
              limit: action.payload.data.pagination.limit || 10,
              hasNextPage: action.payload.data.pagination.hasNextPage || false,
              hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
            };
          }
        }
      })
      .addCase(fetchTodayBookings.rejected, (state, action) => {
        state.bookingsLoading = false;
        state.bookingsError = action.payload || action.error.message;
      })

      // Fetch Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.activityLoading = true;
        state.activityError = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activityError = null;
        if (action.payload?.data) {
          state.recentActivity = action.payload.data;
        }
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.activityError = action.payload || action.error.message;
      })

      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.statsError = null;
        if (action.payload?.data) {
          state.stats = action.payload.data;
        }
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload || action.error.message;
      });
  },
});

export const { resetDashboardState, setBookingsPage } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
