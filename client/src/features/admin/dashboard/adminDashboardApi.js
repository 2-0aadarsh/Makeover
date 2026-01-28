import axios from 'axios';
import { backendurl } from '../../../constants';

// Create axios instance with default config
const adminDashboardApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/dashboard`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests (accessToken & refreshToken)
});

// Response interceptor for error handling
adminDashboardApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      console.error('Unauthorized access to admin dashboard');
      window.location.href = '/auth/login';
    }
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      // Check if admin account is deactivated
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
      // Other 403 errors (not admin) - redirect to home
      console.error('Admin access required');
      window.location.href = '/';
    }
    
    const errorMessage = error.response?.data?.message || 'An error occurred while fetching dashboard data';
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Dashboard API functions
export const adminDashboardApi = {
  /**
   * Get dashboard metrics (Total Users, Total Bookings, Total Revenue, Upcoming Bookings)
   * @returns {Promise} Dashboard metrics data
   */
  getDashboardMetrics: () => {
    return adminDashboardApiInstance.get('/metrics');
  },

  /**
   * Get today's bookings with pagination
   * @param {Object} params - Query parameters { page, limit, status }
   * @returns {Promise} Today's bookings with pagination info
   */
  getTodayBookings: (params = {}) => {
    return adminDashboardApiInstance.get('/today-bookings', { params });
  },

  /**
   * Get recent activity (bookings, enquiries, users)
   * @param {Object} params - Query parameters { limit }
   * @returns {Promise} Recent activity data
   */
  getRecentActivity: (params = {}) => {
    return adminDashboardApiInstance.get('/recent-activity', { params });
  },

  /**
   * Get dashboard statistics (booking status breakdown, payment status, monthly revenue)
   * @returns {Promise} Dashboard statistics data
   */
  getDashboardStats: () => {
    return adminDashboardApiInstance.get('/stats');
  },
};
