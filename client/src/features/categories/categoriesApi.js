import axios from 'axios';
import { backendurl } from '../../constants';

// Create axios instance with default config
const categoriesApiInstance = axios.create({
  baseURL: `${backendurl}/api/categories`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
categoriesApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching categories';
    return Promise.reject(new Error(errorMessage));
  }
);

// Public Categories API functions
export const categoriesApi = {
  /**
   * Get all active categories
   * @returns {Promise} Categories data
   */
  getAllCategories: () => {
    return categoriesApiInstance.get('/');
  },

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} Category details
   */
  getCategoryById: (categoryId) => {
    return categoriesApiInstance.get(`/${categoryId}`);
  },

  /**
   * Get all active services for a category
   * @param {string} categoryId - Category ID
   * @returns {Promise} Services in category
   */
  getCategoryServices: (categoryId) => {
    return categoriesApiInstance.get(`/${categoryId}/services`);
  },
};
