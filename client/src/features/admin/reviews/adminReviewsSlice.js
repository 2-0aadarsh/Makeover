import { createSlice } from '@reduxjs/toolkit';
import { fetchAllReviews } from './adminReviewsThunks';

const initialState = {
  reviews: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    totalReviews: 0,
    positive: 0,
    negative: 0,
    pending: 0,
  },
  loading: false,
  error: null,
  // Search and filter state
  searchQuery: '',
  ratingFilter: '',
  statusFilter: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const adminReviewsSlice = createSlice({
  name: 'adminReviews',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setRatingFilter: (state, action) => {
      state.ratingFilter = action.payload;
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
      state.ratingFilter = '';
      state.statusFilter = '';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.reviews = action.payload.data.reviews || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalReviews: action.payload.data.pagination.totalReviews || 0,
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
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setRatingFilter,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  setPage,
  resetFilters,
} = adminReviewsSlice.actions;

export default adminReviewsSlice.reducer;
