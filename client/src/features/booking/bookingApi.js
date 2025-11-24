import axios from 'axios';
import { backendurl } from '../../constants';

// Create axios instance with default config
const bookingApiInstance = axios.create({
  baseURL: `${backendurl}/api/bookings`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests (accessToken & refreshToken)
});

// Note: Authentication is handled via HttpOnly cookies (accessToken & refreshToken)
// No need to manually add Authorization header since cookies are sent automatically

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
  rescheduleBooking: (bookingId, rescheduleData) => {
    console.log('📡 API: Reschedule booking request:', {
      bookingId,
      rescheduleData
    });
    
    return bookingApiInstance.patch(`/${bookingId}/reschedule`, rescheduleData);
  },

  // Update payment status
  updatePaymentStatus: (bookingId, paymentDetails) => {
    return bookingApiInstance.put(`/${bookingId}/payment-status`, paymentDetails);
  },

  // Complete booking payment
  completeBookingPayment: (bookingId, paymentData) => {
    console.log('📡 API: Complete booking payment request:', {
      bookingId,
      paymentMethod: paymentData.paymentMethod,
      hasRazorpayData: !!(paymentData.razorpayOrderId && paymentData.razorpayPaymentId && paymentData.razorpaySignature)
    });
    
    return bookingApiInstance.post(`/${bookingId}/complete-payment`, paymentData);
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
  },

  // Get minimum order value config
  getMinimumOrderValue: () => {
    return axios.get(`${backendurl}/api/admin/booking-config/MINIMUM_ORDER_VALUE`, {
      withCredentials: true,
      timeout: 5000
    });
  }
};

export default bookingApi;
