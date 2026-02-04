import axios from 'axios';
const backendurl = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const adminEnquiriesApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/enquiries`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminEnquiriesApiInstance.interceptors.response.use(
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
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching enquiries';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Enquiries API functions
export const adminEnquiriesApi = {
  /**
   * Get all enquiries with filters, search, and pagination
   * @param {Object} params - { page, limit, status, priority, source, search, sortBy, sortOrder, startDate, endDate }
   * @returns {Promise} Enquiries data with pagination
   */
  getAllEnquiries: (params = {}) => {
    return adminEnquiriesApiInstance.get('/', { params });
  },
};
