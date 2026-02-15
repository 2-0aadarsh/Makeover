import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboardMetrics,
  fetchTodayBookings,
  fetchRecentActivity,
  fetchDashboardStats,
} from './adminDashboardThunks';

const initialBookingsPagination = {
  currentPage: 1,
  totalPages: 1,
  totalBookings: 0,
  limit: 10,
  hasNextPage: false,
  hasPrevPage: false,
};

const initialBookingsCache = {
  today: null,
  tomorrow: null,
  week: null,
};

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

  // Bookings by period: current selection and cache (persisted; cleared on logout)
  bookingsPeriod: 'today',
  bookingsCache: initialBookingsCache,
  todayBookings: [],
  bookingsPagination: initialBookingsPagination,
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
    // Set period (today/tomorrow/week); fill from cache if available
    setBookingsPeriod: (state, action) => {
      const period = action.payload;
      if (!['today', 'tomorrow', 'week'].includes(period)) return;
      state.bookingsPeriod = period;
      const cached = state.bookingsCache[period];
      if (cached) {
        state.todayBookings = cached.bookings || [];
        state.bookingsPagination = { ...initialBookingsPagination, ...cached.pagination };
      } else {
        state.todayBookings = [];
        state.bookingsPagination = { ...initialBookingsPagination, currentPage: 1 };
      }
    },
    // Clear only bookings cache (for logout); keeps metrics/activity/stats
    clearDashboardBookingsCache: (state) => {
      state.bookingsPeriod = 'today';
      state.bookingsCache = { today: null, tomorrow: null, week: null };
      state.todayBookings = [];
      state.bookingsPagination = { ...initialBookingsPagination };
      state.bookingsLoading = false;
      state.bookingsError = null;
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
          const period = action.payload.data.period || state.bookingsPeriod || 'today';
          const bookings = action.payload.data.bookings || [];
          const pagination = action.payload.data.pagination
            ? {
                currentPage: action.payload.data.pagination.currentPage || 1,
                totalPages: action.payload.data.pagination.totalPages || 1,
                totalBookings: action.payload.data.pagination.totalBookings || 0,
                limit: action.payload.data.pagination.limit || 10,
                hasNextPage: action.payload.data.pagination.hasNextPage || false,
                hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
              }
            : { ...initialBookingsPagination };
          state.todayBookings = bookings;
          state.bookingsPagination = pagination;
          state.bookingsCache[period] = { bookings, pagination };
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
      })

      // Clear bookings cache on logout (dev and production)
      .addMatcher(
        (action) => action.type === 'auth/logout/fulfilled',
        (state) => {
          state.bookingsPeriod = 'today';
          state.bookingsCache = { today: null, tomorrow: null, week: null };
          state.todayBookings = [];
          state.bookingsPagination = { ...initialBookingsPagination };
          state.bookingsLoading = false;
          state.bookingsError = null;
        }
      );
  },
});

export const { resetDashboardState, setBookingsPage, setBookingsPeriod, clearDashboardBookingsCache } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
