import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllAdmins,
  fetchAdminStats,
  fetchAdminById,
  createAdmin,
  updateAdmin,
  resetAdminPassword,
  toggleAdminStatus,
  deleteAdmin,
} from './adminAdminsThunks';

const initialState = {
  admins: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalAdmins: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
  },
  loading: false,
  error: null,
  // Admin details for view/update
  adminDetails: null,
  detailsLoading: false,
  detailsError: null,
  // Search and filter state
  searchQuery: '',
  statusFilter: 'all', // 'all', 'active', 'inactive'
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const adminAdminsSlice = createSlice({
  name: 'adminAdmins',
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
      state.statusFilter = 'all';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.pagination.currentPage = 1;
    },
    clearAdminDetails: (state) => {
      state.adminDetails = null;
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Admins
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.admins = action.payload.data.admins || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalAdmins: action.payload.data.pagination.totalAdmins || 0,
              limit: action.payload.data.pagination.limit || 10,
              hasNextPage: action.payload.data.pagination.hasNextPage || false,
              hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
            };
          }
          if (action.payload.data.stats) {
            state.stats = action.payload.data.stats;
          }
        }
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch Admin Stats
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.stats = action.payload.data;
        }
      })

      // Fetch Admin By ID
      .addCase(fetchAdminById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;
        if (action.payload?.data) {
          state.adminDetails = action.payload.data;
        }
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || action.error.message;
        state.adminDetails = null;
      })

      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update Admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update admin in list if exists
        if (action.payload?.data) {
          const index = state.admins.findIndex(
            (admin) => admin.id === action.payload.data.id
          );
          if (index !== -1) {
            state.admins[index] = action.payload.data;
          }
          // Update adminDetails if it's the same admin
          if (state.adminDetails?.id === action.payload.data.id) {
            state.adminDetails = action.payload.data;
          }
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Toggle Admin Status
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const index = state.admins.findIndex(
            (admin) => admin.id === action.payload.data.id
          );
          if (index !== -1) {
            state.admins[index].isActive = action.payload.data.isActive;
          }
        }
      })

      // Delete Admin
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        // Remove deleted admin from list
        state.admins = state.admins.filter(
          (admin) => admin.id !== action.meta.arg
        );
        // Clear adminDetails if it was the deleted admin
        if (state.adminDetails?.id === action.meta.arg) {
          state.adminDetails = null;
        }
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
  clearAdminDetails,
} = adminAdminsSlice.actions;

export default adminAdminsSlice.reducer;
