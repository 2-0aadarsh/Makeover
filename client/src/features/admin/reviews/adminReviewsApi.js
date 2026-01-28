import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminReviewsApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/reviews`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminReviewsApiInstance.interceptors.response.use(
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
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching reviews';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Reviews API functions
export const adminReviewsApi = {
  /**
   * Get all reviews/complaints with filters, search, and pagination
   * @param {Object} params - { page, limit, rating, status, search, sortBy, sortOrder }
   * @returns {Promise} Reviews data with pagination
   */
  getAllReviews: (params = {}) => {
    return adminReviewsApiInstance.get('/', { params });
  },

  /**
   * Get review details by ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} Review details
   */
  getReviewById: (reviewId) => {
    return adminReviewsApiInstance.get(`/${reviewId}`);
  },

  /**
   * Update review status
   * @param {string} reviewId - Review ID
   * @param {Object} data - { status, adminResponse }
   * @returns {Promise} Updated review data
   */
  updateReviewStatus: (reviewId, data) => {
    return adminReviewsApiInstance.patch(`/${reviewId}/status`, data);
  },
};
