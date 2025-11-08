import axios from 'axios';
import { backendurl } from '../../constants';

// Create axios instance with default config
const paymentApi = axios.create({
  baseURL: `${backendurl}/api/payment`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Remove the Authorization header interceptor since we're using cookies
// The backend will automatically read the accessToken cookie

// Add response interceptor for error handling
paymentApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Payment request failed';
    return Promise.reject(new Error(message));
  }
);

/**
 * Create a new payment order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Payment order response
 */
export const createPaymentOrder = async (orderData) => {
  try {
    console.log('🔍 [PAYMENT API DEBUG] Sending order data to server:', {
      hasBookingDetails: !!orderData.bookingDetails,
      hasBooking: !!orderData.booking,
      bookingDetails: orderData.bookingDetails,
      booking: orderData.booking,
      servicesCount: orderData.services?.length,
      totalAmount: orderData.totalAmount,
      orderNumber: orderData.orderNumber,
      timestamp: new Date().toISOString()
    });
    
    const response = await paymentApi.post('/create-order', orderData);
    return response;
  } catch (error) {
    console.error('Create payment order error:', error);
    throw error;
  }
};

/**
 * Verify payment
 * @param {Object} paymentData - Payment verification data
 * @returns {Promise<Object>} Payment verification response
 */
export const verifyPayment = async (paymentData) => {
  try {
    console.log('🔍 [PAYMENT API DEBUG] Verifying payment with data:', {
      hasOrderId: !!paymentData.orderId,
      hasPaymentId: !!paymentData.paymentId,
      hasSignature: !!paymentData.signature,
      hasOrderNumber: !!paymentData.orderNumber,
      hasServices: !!paymentData.services,
      servicesLength: paymentData.services?.length,
      paymentDataKeys: Object.keys(paymentData),
      timestamp: new Date().toISOString()
    });

    const response = await paymentApi.post('/verify', paymentData);
    console.log('✅ [PAYMENT API DEBUG] Verification response:', response);
    return response;
  } catch (error) {
    console.error('❌ [PAYMENT API DEBUG] Payment verification error:', error);
    throw error;
  }
};

/**
 * Create COD order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} COD order response
 */
export const createCODOrder = async (orderData) => {
  try {
    const response = await paymentApi.post('/create-cod', orderData);
    return response;
  } catch (error) {
    console.error('Create COD order error:', error);
    throw error;
  }
};

/**
 * Get payment history
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Payment history
 */
export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await paymentApi.get('/history', { params });
    return response;
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
};

/**
 * Get payment details by ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await paymentApi.get(`/${paymentId}`);
    return response;
  } catch (error) {
    console.error('Get payment details error:', error);
    throw error;
  }
};

/**
 * Cancel payment order
 * @param {string} orderId - Order ID to cancel
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelPaymentOrder = async (orderId) => {
  try {
    const response = await paymentApi.post('/cancel', { orderId });
    return response;
  } catch (error) {
    console.error('Cancel payment order error:', error);
    throw error;
  }
};

/**
 * Get payment statistics
 * @returns {Promise<Object>} Payment statistics
 */
export const getPaymentStats = async () => {
  try {
    const response = await paymentApi.get('/stats/overview');
    return response;
  } catch (error) {
    console.error('Get payment stats error:', error);
    throw error;
  }
};

export default paymentApi;
