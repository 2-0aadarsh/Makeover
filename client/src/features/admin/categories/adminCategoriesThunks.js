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

/**
 * Get category by ID
 */
export const fetchCategoryById = createAsyncThunk(
  'adminCategories/fetchById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.getCategoryById(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch category details');
    }
  }
);

/**
 * Create new category
 */
export const createCategory = createAsyncThunk(
  'adminCategories/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.createCategory(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

/**
 * Update category
 */
export const updateCategory = createAsyncThunk(
  'adminCategories/update',
  async ({ categoryId, formData }, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.updateCategory(categoryId, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

/**
 * Delete category
 */
export const deleteCategory = createAsyncThunk(
  'adminCategories/delete',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.deleteCategory(categoryId);
      return { ...response, categoryId }; // Include ID for state update
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

/**
 * Toggle category active status
 */
export const toggleCategoryActive = createAsyncThunk(
  'adminCategories/toggleActive',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await adminCategoriesApi.toggleCategoryActive(categoryId);
      return { ...response?.data, categoryId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle category status');
    }
  }
);
