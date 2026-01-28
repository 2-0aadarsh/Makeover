import { createSlice } from '@reduxjs/toolkit';
import { fetchAllCustomers } from './adminCustomersThunks';

const initialState = {
  customers: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  // Search and filter state
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const adminCustomersSlice = createSlice({
  name: 'adminCustomers',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
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
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.customers = action.payload.data.customers || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalCustomers: action.payload.data.pagination.totalCustomers || 0,
              limit: action.payload.data.pagination.limit || 8,
              hasNextPage: action.payload.data.pagination.hasNextPage || false,
              hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
            };
          }
        }
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setPage,
  resetFilters,
} = adminCustomersSlice.actions;

export default adminCustomersSlice.reducer;
