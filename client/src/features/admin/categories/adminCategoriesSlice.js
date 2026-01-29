import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchAllCategories, 
  fetchCategoryServices,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive
} from './adminCategoriesThunks';

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
  // Selected category details
  selectedCategory: null,
  selectedCategoryLoading: false,
  selectedCategoryError: null,
  // Selected category services
  selectedCategoryServices: [],
  servicesLoading: false,
  servicesError: null,
  // Operation states
  creating: false,
  updating: false,
  deleting: false,
  operationError: null,
};

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {
    clearSelectedCategoryServices: (state) => {
      state.selectedCategoryServices = [];
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      state.selectedCategoryError = null;
    },
    clearOperationError: (state) => {
      state.operationError = null;
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
      })

      // Fetch Category By ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.selectedCategoryLoading = true;
        state.selectedCategoryError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategoryError = null;
        const responseData = action.payload?.data;
        if (responseData) {
          state.selectedCategory = {
            ...responseData,
            id: responseData.id || responseData._id,
            _id: responseData._id || responseData.id,
          };
        }
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategoryError = action.payload || action.error.message;
        state.selectedCategory = null;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.creating = true;
        state.operationError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.creating = false;
        state.operationError = null;
        const responseData = action.payload?.data;
        if (responseData) {
          const newCategory = {
            ...responseData,
            id: responseData.id || responseData._id,
            _id: responseData._id || responseData.id,
          };
          state.categories.unshift(newCategory); // Add to beginning
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.creating = false;
        state.operationError = action.payload || action.error.message;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.updating = true;
        state.operationError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updating = false;
        state.operationError = null;
        const responseData = action.payload?.data;
        if (responseData) {
          const updatedCategory = {
            ...responseData,
            id: responseData.id || responseData._id,
            _id: responseData._id || responseData.id,
          };
          // Update in categories list
          const index = state.categories.findIndex(
            (cat) => (cat.id || cat._id) === (updatedCategory.id || updatedCategory._id)
          );
          if (index !== -1) {
            state.categories[index] = updatedCategory;
          }
          // Update selected category if it's the same
          if (state.selectedCategory && (state.selectedCategory.id === updatedCategory.id || state.selectedCategory._id === updatedCategory._id)) {
            state.selectedCategory = updatedCategory;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updating = false;
        state.operationError = action.payload || action.error.message;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.deleting = true;
        state.operationError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleting = false;
        state.operationError = null;
        const categoryId = action.payload?.categoryId;
        if (categoryId) {
          // Remove from categories list
          state.categories = state.categories.filter(
            (cat) => (cat.id || cat._id) !== categoryId
          );
          // Clear selected category if it's the deleted one
          if (state.selectedCategory && (state.selectedCategory.id === categoryId || state.selectedCategory._id === categoryId)) {
            state.selectedCategory = null;
          }
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleting = false;
        state.operationError = action.payload || action.error.message;
      })

      // Toggle Category Active
      .addCase(toggleCategoryActive.pending, (state) => {
        state.operationError = null;
      })
      .addCase(toggleCategoryActive.fulfilled, (state, action) => {
        state.operationError = null;
        const { categoryId, isActive } = action.payload || {};
        if (categoryId) {
          const idStr = String(categoryId);
          const index = state.categories.findIndex(
            (cat) => String(cat.id || cat._id) === idStr
          );
          if (index !== -1) {
            state.categories[index].isActive = isActive;
          }
          if (state.selectedCategory && (String(state.selectedCategory.id || state.selectedCategory._id) === idStr)) {
            state.selectedCategory.isActive = isActive;
          }
        }
      })
      .addCase(toggleCategoryActive.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      });
  },
});

export const { 
  clearSelectedCategoryServices, 
  clearSelectedCategory,
  clearOperationError 
} = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
