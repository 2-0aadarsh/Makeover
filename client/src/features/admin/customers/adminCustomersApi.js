import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminCustomersApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/customers`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminCustomersApiInstance.interceptors.response.use(
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
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching customers';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Customers API functions
export const adminCustomersApi = {
  /**
   * Get all customers with search and pagination
   * @param {Object} params - { page, limit, search, sortBy, sortOrder }
   * @returns {Promise} Customers data with pagination
   */
  getAllCustomers: (params = {}) => {
    return adminCustomersApiInstance.get('/', { params });
  },
};
