import axios from 'axios';
const backendurl = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const servicesApiInstance = axios.create({
  baseURL: `${backendurl}/api/services`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
servicesApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching services';
    return Promise.reject(new Error(errorMessage));
  }
);

// Public Services API functions
export const servicesApi = {
  /**
   * Get all services with optional filters
   * @param {Object} params - { page, limit, categoryId, isActive, search }
   * @returns {Promise} Services data with pagination
   */
  getAllServices: (params = {}) => {
    return servicesApiInstance.get('/', { params });
  },

  /**
   * Get services by category
   * @param {string} category - Category slug or name
   * @returns {Promise} Services in category
   */
  getServicesByCategory: (category) => {
    return servicesApiInstance.get(`/category/${category}`);
  },

  /**
   * Get service by ID
   * @param {string} serviceId - Service ID
   * @returns {Promise} Service details
   */
  getServiceById: (serviceId) => {
    return servicesApiInstance.get(`/${serviceId}`);
  },
};
