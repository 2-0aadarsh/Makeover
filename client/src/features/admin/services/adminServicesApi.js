import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminServicesApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/services`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// When sending FormData, do NOT set Content-Type so axios adds multipart/form-data with boundary.
// Otherwise the server cannot parse the body and req.body.options (and other fields) are missing.
adminServicesApiInstance.interceptors.request.use((config) => {
  if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response interceptor for error handling
adminServicesApiInstance.interceptors.response.use(
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
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching services';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Services API functions
export const adminServicesApi = {
  /**
   * Get all services
   * @param {Object} params - { page, limit, categoryId, isActive, search, sortBy, sortOrder }
   * @returns {Promise} Services data with pagination
   */
  getAllServices: (params = {}) => {
    return adminServicesApiInstance.get('/', { params });
  },

  /**
   * Get services by category
   * @param {string} categoryId - Category ID
   * @param {Object} params - { page, limit, isActive }
   * @returns {Promise} Services in category
   */
  getServicesByCategory: (categoryId, params = {}) => {
    return adminServicesApiInstance.get(`/by-category/${categoryId}`, { params });
  },

  /**
   * Get service details by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise} Service details
   */
  getServiceById: (serviceId) => {
    return adminServicesApiInstance.get(`/${serviceId}`);
  },

  /**
   * Create new service
   * @param {FormData} formData - Service data with images
   * @returns {Promise} Created service data
   */
  createService: (formData) => {
    return adminServicesApiInstance.post('/', formData);
  },

  /**
   * Update service
   * @param {string} serviceId - Service ID
   * @param {FormData} formData - Updated service data
   * @returns {Promise} Updated service data
   */
  updateService: (serviceId, formData) => {
    return adminServicesApiInstance.put(`/${serviceId}`, formData);
  },

  /**
   * Delete service
   * @param {string} serviceId - Service ID
   * @returns {Promise} Deletion result
   */
  deleteService: (serviceId) => {
    return adminServicesApiInstance.delete(`/${serviceId}`);
  },

  /**
   * Toggle service availability (available / not available at the moment)
   * @param {string} serviceId - Service ID
   * @returns {Promise} Updated service data
   */
  toggleServiceAvailability: (serviceId) => {
    return adminServicesApiInstance.patch(`/${serviceId}/toggle`);
  },

  /**
   * Toggle service active status (show / hide on site)
   * @param {string} serviceId - Service ID
   * @returns {Promise} Updated service data
   */
  toggleServiceActive: (serviceId) => {
    return adminServicesApiInstance.patch(`/${serviceId}/toggle-active`);
  },
};
