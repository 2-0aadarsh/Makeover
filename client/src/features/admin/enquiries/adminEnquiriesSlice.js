import { createSlice } from '@reduxjs/toolkit';
import { fetchAllEnquiries } from './adminEnquiriesThunks';

const initialState = {
  enquiries: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEnquiries: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    totalEnquiries: 0,
    pending: 0,
    contacted: 0,
    quoted: 0,
    converted: 0,
    cancelled: 0,
  },
  loading: false,
  error: null,
  // Search and filter state
  searchQuery: '',
  statusFilter: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const adminEnquiriesSlice = createSlice({
  name: 'adminEnquiries',
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
      .addCase(fetchAllEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.enquiries = action.payload.data.enquiries || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalEnquiries: action.payload.data.pagination.totalEnquiries || 0,
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
      .addCase(fetchAllEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
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
} = adminEnquiriesSlice.actions;

export default adminEnquiriesSlice.reducer;
