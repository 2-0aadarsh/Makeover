import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminBookingsApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/bookings`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminBookingsApiInstance.interceptors.response.use(
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
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching bookings';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Bookings API functions
export const adminBookingsApi = {
  /**
   * Get all bookings with filters, search, and pagination
   * @param {Object} params - { page, limit, status, paymentStatus, search, sortBy, sortOrder, startDate, endDate }
   * @returns {Promise} Bookings data with pagination
   */
  getAllBookings: (params = {}) => {
    return adminBookingsApiInstance.get('/', { params });
  },

  /**
   * Get single booking details by ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Booking details data
   */
  getBookingById: (bookingId) => {
    return adminBookingsApiInstance.get(`/${bookingId}`);
  },
};
