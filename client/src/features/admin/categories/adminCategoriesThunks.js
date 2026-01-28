import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminCategoriesApi } from './adminCategoriesApi';

/**
 * Fetch all categories
 */
export const fetchAllCategories = createAsyncThunk(
  'adminCategories/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.getAllCategories(params);
      console.log('fetchAllCategories API response:', response);
      return response;
    } catch (error) {
      console.error('fetchAllCategories error:', error);
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

/**
 * Fetch services in a category
 */
export const fetchCategoryServices = createAsyncThunk(
  'adminCategories/fetchServices',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.getCategoryServices(categoryId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch category services');
    }
  }
);
