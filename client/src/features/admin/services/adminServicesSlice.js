import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllServices,
  fetchServicesByCategory,
  fetchServiceById,
  deleteServiceThunk,
  toggleServiceAvailabilityThunk,
  toggleServiceActiveThunk,
} from './adminServicesThunks';

const initialState = {
  services: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalServices: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  // Services by category
  servicesByCategory: [],
  categoryServicesLoading: false,
  categoryServicesError: null,
  // Service details for update
  serviceDetails: null,
  detailsLoading: false,
  detailsError: null,
};

const adminServicesSlice = createSlice({
  name: 'adminServices',
  initialState,
  reducers: {
    clearServicesByCategory: (state) => {
      state.servicesByCategory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Services
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.data) {
          state.services = action.payload.data.services || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              currentPage: action.payload.data.pagination.currentPage || 1,
              totalPages: action.payload.data.pagination.totalPages || 1,
              totalServices: action.payload.data.pagination.totalServices || 0,
              limit: action.payload.data.pagination.limit || 20,
              hasNextPage: action.payload.data.pagination.hasNextPage || false,
              hasPrevPage: action.payload.data.pagination.hasPrevPage || false,
            };
          }
        }
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch Services By Category
      .addCase(fetchServicesByCategory.pending, (state) => {
        state.categoryServicesLoading = true;
        state.categoryServicesError = null;
      })
      .addCase(fetchServicesByCategory.fulfilled, (state, action) => {
        state.categoryServicesLoading = false;
        state.categoryServicesError = null;
        if (action.payload?.data) {
          state.servicesByCategory = action.payload.data.services || [];
        }
      })
      .addCase(fetchServicesByCategory.rejected, (state, action) => {
        state.categoryServicesLoading = false;
        state.categoryServicesError = action.payload || action.error.message;
        state.servicesByCategory = [];
      })

      // Fetch Service By ID
      .addCase(fetchServiceById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;
        if (action.payload?.data) {
          state.serviceDetails = action.payload.data;
        }
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || action.error.message;
        state.serviceDetails = null;
      })

      // Delete Service
      .addCase(deleteServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Service will be removed from list when services are refetched
      })
      .addCase(deleteServiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Toggle Service Availability
      .addCase(toggleServiceAvailabilityThunk.fulfilled, (state, action) => {
        const { id, isAvailable } = action.payload?.data || {};
        if (id && state.servicesByCategory?.length) {
          const idx = state.servicesByCategory.findIndex((s) => (s.id || s._id) === id);
          if (idx !== -1) state.servicesByCategory[idx].isAvailable = isAvailable;
        }
      })

      // Toggle Service Active
      .addCase(toggleServiceActiveThunk.fulfilled, (state, action) => {
        const { id, isActive } = action.payload?.data || {};
        if (id && state.servicesByCategory?.length) {
          const idx = state.servicesByCategory.findIndex((s) => (s.id || s._id) === id);
          if (idx !== -1) state.servicesByCategory[idx].isActive = isActive;
        }
      });
  },
});

export const { clearServicesByCategory } = adminServicesSlice.actions;
export default adminServicesSlice.reducer;
