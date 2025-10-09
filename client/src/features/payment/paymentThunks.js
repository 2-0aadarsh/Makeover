import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPaymentOrder,
  verifyPayment,
  createCODOrder,
  getPaymentHistory,
  getPaymentDetails,
  cancelPaymentOrder,
  getPaymentStats
} from './paymentApi';

/**
 * Create payment order thunk with enhanced error handling
 */
export const createPaymentOrderThunk = createAsyncThunk(
  'payment/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      console.log('Creating payment order with data:', orderData);
      
      // Note: Authentication is handled via HTTP cookies automatically
      // The backend will read the accessToken cookie for authentication
      
      // Validate required data
      if (!orderData.services || !Array.isArray(orderData.services) || orderData.services.length === 0) {
        throw new Error('Services are required');
      }

      if (!orderData.bookingDetails) {
        throw new Error('Booking details are required');
      }

      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error('Valid total amount is required');
      }

      // Add metadata
      const enhancedOrderData = {
        ...orderData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      console.log('Sending enhanced order data:', enhancedOrderData);
      const response = await createPaymentOrder(enhancedOrderData);
      console.log('Payment order response:', response);
      return response;
    } catch (error) {
      console.error('Create payment order thunk error:', error);
      return rejectWithValue(error.message || 'Failed to create payment order');
    }
  }
);

/**
 * Verify payment thunk with enhanced error handling
 */
export const verifyPaymentThunk = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue, getState }) => {
    try {
      // Validate required fields
      if (!paymentData.orderId || !paymentData.paymentId || !paymentData.signature) {
        throw new Error('Order ID, Payment ID, and Signature are required');
      }

      const response = await verifyPayment(paymentData);
      return response;
    } catch (error) {
      console.error('Verify payment thunk error:', error);
      return rejectWithValue(error.message || 'Payment verification failed');
    }
  }
);

/**
 * Create COD order thunk
 */
export const createCODOrderThunk = createAsyncThunk(
  'payment/createCOD',
  async (orderData, { rejectWithValue }) => {
    try {
      // Validate required data
      if (!orderData.services || !Array.isArray(orderData.services) || orderData.services.length === 0) {
        throw new Error('Services are required');
      }

      if (!orderData.bookingDetails) {
        throw new Error('Booking details are required');
      }

      if (!orderData.totalAmount || orderData.totalAmount <= 0) {
        throw new Error('Valid total amount is required');
      }

      // Add metadata
      const enhancedOrderData = {
        ...orderData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      const response = await createCODOrder(enhancedOrderData);
      return response;
    } catch (error) {
      console.error('Create COD order thunk error:', error);
      return rejectWithValue(error.message || 'Failed to create COD order');
    }
  }
);

/**
 * Get payment history thunk with pagination
 */
export const getPaymentHistoryThunk = createAsyncThunk(
  'payment/getHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Default pagination parameters
      const defaultParams = {
        page: 1,
        limit: 10
      };

      const queryParams = { ...defaultParams, ...params };

      const response = await getPaymentHistory(queryParams);
      return response;
    } catch (error) {
      console.error('Get payment history thunk error:', error);
      return rejectWithValue(error.message || 'Failed to fetch payment history');
    }
  }
);

/**
 * Get payment details thunk
 */
export const getPaymentDetailsThunk = createAsyncThunk(
  'payment/getDetails',
  async (paymentId, { rejectWithValue }) => {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const response = await getPaymentDetails(paymentId);
      return response;
    } catch (error) {
      console.error('Get payment details thunk error:', error);
      return rejectWithValue(error.message || 'Failed to fetch payment details');
    }
  }
);

/**
 * Cancel payment order thunk
 */
export const cancelPaymentOrderThunk = createAsyncThunk(
  'payment/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await cancelPaymentOrder(orderId);
      return response;
    } catch (error) {
      console.error('Cancel payment order thunk error:', error);
      return rejectWithValue(error.message || 'Failed to cancel payment order');
    }
  }
);

/**
 * Get payment statistics thunk
 */
export const getPaymentStatsThunk = createAsyncThunk(
  'payment/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentStats();
      return response;
    } catch (error) {
      console.error('Get payment stats thunk error:', error);
      return rejectWithValue(error.message || 'Failed to fetch payment statistics');
    }
  }
);

/**
 * Complete payment flow thunk (creates order and handles Razorpay)
 */
export const completePaymentFlowThunk = createAsyncThunk(
  'payment/completeFlow',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      // Step 1: Create payment order
      const orderResponse = await dispatch(createPaymentOrderThunk(orderData));
      
      if (orderResponse.type.endsWith('/rejected')) {
        throw new Error(orderResponse.payload);
      }

      const { orderId, amount, currency, key } = orderResponse.payload.data;

      // Step 2: Initialize Razorpay and handle payment
      return new Promise((resolve, reject) => {
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          reject(new Error('Razorpay not loaded'));
          return;
        }

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: 'Makeover',
          description: 'Beauty Services Booking',
          order_id: orderId,
          handler: async function (response) {
            try {
              // Step 3: Verify payment
              const verificationData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              };

              const verificationResponse = await dispatch(verifyPaymentThunk(verificationData));
              
              if (verificationResponse.type.endsWith('/rejected')) {
                reject(new Error(verificationResponse.payload));
              } else {
                resolve(verificationResponse.payload);
              }
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: orderData.bookingDetails.address.name || 'Customer',
            email: orderData.bookingDetails.address.email || '',
            contact: orderData.bookingDetails.address.phone || ''
          },
          notes: {
            booking_date: orderData.bookingDetails.date,
            booking_slot: orderData.bookingDetails.slot,
            services_count: orderData.services.length
          },
          theme: {
            color: '#CC2B52'
          },
          modal: {
            ondismiss: function() {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });

    } catch (error) {
      console.error('Complete payment flow thunk error:', error);
      return rejectWithValue(error.message || 'Payment flow failed');
    }
  }
);

/**
 * Complete COD flow thunk
 */
export const completeCODFlowThunk = createAsyncThunk(
  'payment/completeCODFlow',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      // Create COD order directly
      const codResponse = await dispatch(createCODOrderThunk(orderData));
      
      if (codResponse.type.endsWith('/rejected')) {
        throw new Error(codResponse.payload);
      }

      return codResponse.payload;
    } catch (error) {
      console.error('Complete COD flow thunk error:', error);
      return rejectWithValue(error.message || 'COD order creation failed');
    }
  }
);
