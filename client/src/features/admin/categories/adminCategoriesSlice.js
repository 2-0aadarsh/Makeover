import { createSlice } from '@reduxjs/toolkit';
import { fetchAllCategories, fetchCategoryServices } from './adminCategoriesThunks';

const initialState = {
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
  // Selected category services
  selectedCategoryServices: [],
  servicesLoading: false,
  servicesError: null,
};

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {
    clearSelectedCategoryServices: (state) => {
      state.selectedCategoryServices = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Handle response structure - API returns { success, data: { categories, pagination } }
        // Axios interceptor returns response.data, so action.payload is the full response object
        const responseData = action.payload?.data;
        if (responseData && responseData.categories) {
          // Normalize categories to ensure _id is available as both id and _id
          const categories = responseData.categories.map(cat => ({
            ...cat,
            id: cat.id || cat._id?.toString() || cat._id,
            _id: cat._id || cat.id,
          }));
          state.categories = categories;
          console.log('Categories normalized and set:', categories.length, 'categories');
          
          if (responseData.pagination) {
            state.pagination = {
              currentPage: responseData.pagination.currentPage || 1,
              totalPages: responseData.pagination.totalPages || 1,
              totalCategories: responseData.pagination.totalCategories || 0,
              limit: responseData.pagination.limit || 20,
              hasNextPage: responseData.pagination.hasNextPage || false,
              hasPrevPage: responseData.pagination.hasPrevPage || false,
            };
          }
        } else {
          console.warn('No categories in fetchAllCategories response:', {
            payload: action.payload,
            hasData: !!action.payload?.data,
            categories: action.payload?.data?.categories,
          });
          state.categories = [];
        }
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch Category Services
      .addCase(fetchCategoryServices.pending, (state) => {
        state.servicesLoading = true;
        state.servicesError = null;
      })
      .addCase(fetchCategoryServices.fulfilled, (state, action) => {
        state.servicesLoading = false;
        state.servicesError = null;
        // Handle response structure - API returns { success, data: { services, pagination } }
        const responseData = action.payload?.data;
        if (responseData && responseData.services) {
          // Normalize services to ensure _id is available as both id and _id
          const services = responseData.services.map(service => ({
            ...service,
            id: service.id || service._id?.toString() || service._id,
            _id: service._id || service.id,
          }));
          state.selectedCategoryServices = services;
          console.log('Category services normalized and set:', services.length, 'services');
        } else {
          console.warn('No services in fetchCategoryServices response:', {
            payload: action.payload,
            hasData: !!action.payload?.data,
            services: action.payload?.data?.services,
          });
          state.selectedCategoryServices = [];
        }
      })
      .addCase(fetchCategoryServices.rejected, (state, action) => {
        state.servicesLoading = false;
        state.servicesError = action.payload || action.error.message;
        state.selectedCategoryServices = [];
      });
  },
});

export const { clearSelectedCategoryServices } = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
