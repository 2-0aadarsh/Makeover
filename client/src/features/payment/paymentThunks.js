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
      console.log('🔍 [CREATE PAYMENT ORDER DEBUG] Received orderData:', {
        orderData,
        hasBookingDetails: !!orderData?.bookingDetails,
        hasBooking: !!orderData?.booking,
        orderDataKeys: orderData ? Object.keys(orderData) : 'orderData is null/undefined',
        timestamp: new Date().toISOString()
      });
      console.log('Creating payment order with data:', orderData);
      
      // Note: Authentication is handled via HTTP cookies automatically
      // The backend will read the accessToken cookie for authentication
      
      // Validate required data
      if (!orderData.services || !Array.isArray(orderData.services) || orderData.services.length === 0) {
        throw new Error('Services are required');
      }

      // Handle both old format (bookingDetails) and new format (booking)
      const bookingData = orderData.bookingDetails || orderData.booking;
      
      console.log('🔍 [PAYMENT THUNK DEBUG] Booking data validation:', {
        hasBookingDetails: !!orderData.bookingDetails,
        hasBooking: !!orderData.booking,
        bookingDetails: orderData.bookingDetails,
        booking: orderData.booking,
        bookingData: bookingData,
        hasBookingData: !!bookingData,
        orderDataKeys: Object.keys(orderData),
        timestamp: new Date().toISOString()
      });
      
      if (!bookingData) {
        console.error('❌ [PAYMENT THUNK DEBUG] Missing booking data in orderData:', orderData);
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
      console.log('🔍 [VERIFY PAYMENT THUNK DEBUG] Received paymentData:', {
        hasOrderId: !!paymentData.orderId,
        hasPaymentId: !!paymentData.paymentId,
        hasSignature: !!paymentData.signature,
        hasOrderNumber: !!paymentData.orderNumber,
        hasServices: !!paymentData.services,
        servicesLength: paymentData.services?.length,
        paymentDataKeys: Object.keys(paymentData),
        timestamp: new Date().toISOString()
      });

      // Validate required fields
      if (!paymentData.orderId || !paymentData.paymentId || !paymentData.signature) {
        throw new Error('Order ID, Payment ID, and Signature are required');
      }

      console.log('🔍 [VERIFY PAYMENT THUNK DEBUG] Sending to server:', paymentData);

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

      // Handle both old format (bookingDetails) and new format (booking)
      const bookingData = orderData.bookingDetails || orderData.booking;
      
      console.log('🔍 [PAYMENT THUNK DEBUG] Booking data validation:', {
        hasBookingDetails: !!orderData.bookingDetails,
        hasBooking: !!orderData.booking,
        bookingDetails: orderData.bookingDetails,
        booking: orderData.booking,
        bookingData: bookingData,
        hasBookingData: !!bookingData,
        orderDataKeys: Object.keys(orderData),
        timestamp: new Date().toISOString()
      });
      
      if (!bookingData) {
        console.error('❌ [PAYMENT THUNK DEBUG] Missing booking data in orderData:', orderData);
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
      console.log('🔍 [COMPLETE PAYMENT FLOW DEBUG] Received orderData:', {
        orderData,
        hasBookingDetails: !!orderData?.bookingDetails,
        hasBooking: !!orderData?.booking,
        orderDataKeys: orderData ? Object.keys(orderData) : 'orderData is null/undefined',
        timestamp: new Date().toISOString()
      });
      
      // Handle both old format (bookingDetails) and new format (booking)
      const bookingData = orderData.bookingDetails || orderData.booking;
      
      // Step 1: Create payment order
      const orderResponse = await dispatch(createPaymentOrderThunk(orderData));
      
      if (orderResponse.type.endsWith('/rejected')) {
        throw new Error(orderResponse.payload);
      }

      const { orderId, amount, currency, key } = orderResponse.payload.data;

      // Step 2: Initialize Razorpay and handle payment
      return new Promise((resolve, reject) => {
        console.log('🔍 Debug - Razorpay check:', {
          windowRazorpay: !!window.Razorpay,
          key: key,
          amount: amount,
          currency: currency,
          orderId: orderId
        });
        
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          console.error('❌ Razorpay not loaded - Script failed to load');
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
              console.log('🔍 [RAZORPAY SUCCESS DEBUG] Payment successful, building verification data:', {
                razorpayResponse: response,
                originalOrderData: orderData,
                hasBookingDetails: !!orderData.bookingDetails,
                hasBooking: !!orderData.booking,
                orderNumber: orderData.orderNumber,
                servicesCount: orderData.services?.length
              });

              // Step 3: Verify payment with complete order data
              const verificationData = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                // Add required fields for server validation
                orderNumber: orderData.orderNumber,
                services: orderData.services?.map(service => ({
                  serviceId: service.serviceId || service.id,
                  name: service.name,
                  description: service.description || `${service.name} - Professional beauty service`,
                  price: service.price,
                  quantity: service.quantity,
                  image: service.image || '/src/assets/images/default-service.jpg',
                  category: service.category || 'Regular',
                  duration: service.duration || '60'
                })) || []
              };

              console.log('🔍 [VERIFICATION DEBUG] OrderData validation:', {
                hasOrderNumber: !!orderData.orderNumber,
                orderNumber: orderData.orderNumber,
                hasServices: !!orderData.services,
                servicesLength: orderData.services?.length,
                servicesWithDescription: orderData.services?.map(s => ({
                  name: s.name,
                  hasDescription: !!s.description,
                  description: s.description
                }))
              });

              console.log('📦 [RAZORPAY SUCCESS DEBUG] Complete verification payload:', verificationData);

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
            name: bookingData.address?.name || 'Customer',
            email: bookingData.address?.email || '',
            contact: bookingData.address?.phone || ''
          },
          notes: {
            booking_date: bookingData.date,
            booking_slot: bookingData.slot,
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

        console.log('🔍 Debug - Creating Razorpay instance with options:', options);
        console.log('🔍 Debug - Key Razorpay options comparison:', {
          key: options.key,
          amount: options.amount,
          currency: options.currency,
          order_id: options.order_id,
          booking_date: options.notes?.booking_date,
          booking_slot: options.notes?.booking_slot,
          booking_datetime: options.notes?.booking_datetime,
          isTodayBooking: options.notes?.booking_date === new Date().toISOString().split('T')[0],
          currentDate: new Date().toISOString().split('T')[0]
        });
        
        try {
          const razorpay = new window.Razorpay(options);
          console.log('✅ Razorpay instance created successfully');
          
          // Add event handlers to debug modal behavior
          razorpay.on('payment.success', (response) => {
            console.log('🔍 Razorpay payment success:', response);
          });
          
          razorpay.on('payment.error', (error) => {
            console.error('❌ Razorpay payment error:', error);
          });
          
          razorpay.on('payment.cancel', (error) => {
            console.log('🔍 Razorpay payment cancelled:', error);
          });
          
          razorpay.on('modal.close', () => {
            console.log('🔍 Razorpay modal closed');
          });
          
          console.log('🚀 Opening Razorpay payment gateway...');
          console.log('🔍 Browser info:', {
            userAgent: navigator.userAgent,
            isHTTPS: location.protocol === 'https:',
            isLocalhost: location.hostname === 'localhost',
            windowSize: { width: window.innerWidth, height: window.innerHeight },
            documentReadyState: document.readyState
          });
          
          // Try opening with a slight delay to ensure DOM is ready
          setTimeout(() => {
            console.log('🔍 Attempting to open Razorpay modal with delay...');
            razorpay.open();
            console.log('✅ razorpay.open() called successfully');
          }, 100);
          
          // Check if modal opened immediately
          setTimeout(() => {
            console.log('🔍 Immediate check - Razorpay modal status');
            const razorpayElements = document.querySelectorAll('[class*="razorpay"], [id*="razorpay"]');
            console.log('🔍 Found Razorpay elements:', razorpayElements.length);
            if (razorpayElements.length > 0) {
              console.log('🔍 Razorpay modal elements:', razorpayElements);
            }
          }, 100);
          
          // Add a timeout to check if modal opened
          setTimeout(() => {
            console.log('🔍 Checking if Razorpay modal opened after 2 seconds...');
            console.log('🔍 Document body:', document.body);
            console.log('🔍 Razorpay modal elements:', document.querySelectorAll('[class*="razorpay"]'));
            console.log('🔍 All modal/overlay elements:', document.querySelectorAll('[class*="modal"], [class*="overlay"], [class*="popup"]'));
          }, 2000);
          
        } catch (razorpayError) {
          console.error('❌ Razorpay initialization error:', razorpayError);
          reject(new Error(`Razorpay initialization failed: ${razorpayError.message}`));
        }
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
