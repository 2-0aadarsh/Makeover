import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const bookingApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/bookings`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
bookingApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
bookingApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Booking API functions
export const bookingApi = {
  // Get all bookings for the authenticated user
  getUserBookings: (params = {}) => {
    return bookingApiInstance.get('/my-bookings', { params });
  },

  // Get a specific booking by ID
  getBookingById: (bookingId) => {
    return bookingApiInstance.get(`/${bookingId}`);
  },

  // Create a new booking
  createBooking: (bookingData) => {
    return bookingApiInstance.post('/', bookingData);
  },

  // Cancel a booking
  cancelBooking: (bookingId, cancellationReason) => {
    return bookingApiInstance.put(`/${bookingId}/cancel`, {
      action: 'cancel',
      cancellationReason
    });
  },

  // Reschedule a booking
  rescheduleBooking: (bookingId, newDate, newSlot) => {
    return bookingApiInstance.put(`/${bookingId}/reschedule`, {
      action: 'reschedule',
      newDate,
      newSlot
    });
  },

  // Update payment status
  updatePaymentStatus: (bookingId, paymentDetails) => {
    return bookingApiInstance.put(`/${bookingId}/payment-status`, paymentDetails);
  },

  // Get booking statistics
  getBookingStats: () => {
    return bookingApiInstance.get('/stats');
  },

  // Get upcoming bookings
  getUpcomingBookings: (limit = 5) => {
    return bookingApiInstance.get('/upcoming', { params: { limit } });
  },

  // Search bookings
  searchBookings: (query, params = {}) => {
    return bookingApiInstance.get('/search', {
      params: {
        q: query,
        ...params
      }
    });
  },

  // Get available time slots
  getAvailableSlots: (date) => {
    return bookingApiInstance.get('/available-slots', {
      params: { date }
    });
  },

  // Get booking analytics (admin only)
  getBookingAnalytics: (params = {}) => {
    return bookingApiInstance.get('/analytics/overview', { params });
  },

  // Update booking status (admin only)
  updateBookingStatus: (bookingId, status, notes = null) => {
    return bookingApiInstance.put(`/${bookingId}/status`, {
      status,
      notes
    });
  }
};

export default bookingApi;
