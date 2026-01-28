import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminCategoriesApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/categories`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminCategoriesApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('deactivated') || errorMessage.toLowerCase().includes('inactive')) {
        // Show custom modal instead of browser alert
        if (window.showAdminDeactivatedModal) {
          window.showAdminDeactivatedModal();
        } else {
          // Fallback if modal not ready yet
          window.location.href = '/auth/login';
        }
        return Promise.reject(new Error(errorMessage));
      }
      window.location.href = '/';
    }
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching categories';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Categories API functions
export const adminCategoriesApi = {
  /**
   * Get all categories
   * @param {Object} params - { page, limit, isActive, search, sortBy, sortOrder }
   * @returns {Promise} Categories data with pagination
   */
  getAllCategories: (params = {}) => {
    return adminCategoriesApiInstance.get('/', { params });
  },

  /**
   * Get category details by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} Category details
   */
  getCategoryById: (categoryId) => {
    return adminCategoriesApiInstance.get(`/${categoryId}`);
  },

  /**
   * Create new category
   * @param {FormData} formData - Category data with image
   * @returns {Promise} Created category data
   */
  createCategory: (formData) => {
    return adminCategoriesApiInstance.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {FormData} formData - Updated category data
   * @returns {Promise} Updated category data
   */
  updateCategory: (categoryId, formData) => {
    return adminCategoriesApiInstance.put(`/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @returns {Promise} Deletion result
   */
  deleteCategory: (categoryId) => {
    return adminCategoriesApiInstance.delete(`/${categoryId}`);
  },

  /**
   * Get services in a category
   * @param {string} categoryId - Category ID
   * @param {Object} params - { page, limit, isActive }
   * @returns {Promise} Services in category
   */
  getCategoryServices: (categoryId, params = {}) => {
    return adminCategoriesApiInstance.get(`/${categoryId}/services`, { params });
  },
};
