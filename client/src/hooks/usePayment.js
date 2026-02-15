import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createPaymentOrderThunk,
  verifyPaymentThunk,
  createCODOrderThunk,
  getPaymentHistoryThunk,
  getPaymentDetailsThunk,
  cancelPaymentOrderThunk,
  completePaymentFlowThunk,
  completeCODFlowThunk
} from '../features/payment/paymentThunks';
import {
  clearPaymentErrors,
  clearPaymentData,
  setRazorpayLoaded,
  setRazorpayError,
  setCurrentPayment,
  resetCurrentPayment,
  setCurrentOrder,
  clearCurrentOrder
} from '../features/payment/paymentSlice';
import { loadRazorpayScript, getRazorpayOptions } from '../utils/paymentUtils';

/**
 * Custom hook for payment operations
 */
export const usePayment = () => {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);

  // Local state for payment flow
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Initialize Razorpay script
  useEffect(() => {
    const initRazorpay = async () => {
      try {
        console.log('🔍 Initializing Razorpay script...');
        setIsRazorpayLoading(true);
        await loadRazorpayScript();
        dispatch(setRazorpayLoaded(true));
        console.log('✅ Razorpay script loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load Razorpay:', error);
        dispatch(setRazorpayError(error.message));
        setPaymentError(error.message);
      } finally {
        setIsRazorpayLoading(false);
      }
    };

    console.log('🔍 Razorpay initialization check:', {
      razorpayLoaded: paymentState.razorpayLoaded,
      razorpayError: paymentState.razorpayError,
      shouldInit: !paymentState.razorpayLoaded && !paymentState.razorpayError
    });

    if (!paymentState.razorpayLoaded && !paymentState.razorpayError) {
      initRazorpay();
    }
  }, [dispatch, paymentState.razorpayLoaded, paymentState.razorpayError]);

  /**
   * Create payment order
   */
  const createPaymentOrder = useCallback(async (orderData) => {
    try {
      setPaymentError(null);
      const result = await dispatch(createPaymentOrderThunk(orderData));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Verify payment
   */
  const verifyPayment = useCallback(async (paymentData) => {
    try {
      setPaymentError(null);
      const result = await dispatch(verifyPaymentThunk(paymentData));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Create COD order
   */
  const createCODOrder = useCallback(async (orderData) => {
    try {
      setPaymentError(null);
      const result = await dispatch(createCODOrderThunk(orderData));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Get payment history
   */
  const getPaymentHistory = useCallback(async (params = {}) => {
    try {
      setPaymentError(null);
      const result = await dispatch(getPaymentHistoryThunk(params));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Get payment details
   */
  const getPaymentDetails = useCallback(async (paymentId) => {
    try {
      setPaymentError(null);
      const result = await dispatch(getPaymentDetailsThunk(paymentId));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Cancel payment order
   */
  const cancelPaymentOrder = useCallback(async (orderId) => {
    try {
      setPaymentError(null);
      const result = await dispatch(cancelPaymentOrderThunk(orderId));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Complete payment flow (create order + Razorpay + verify)
   */
  const completePaymentFlow = useCallback(async (orderData) => {
    try {
      console.log('🔍 completePaymentFlow called with:', orderData);
      console.log('🔍 Razorpay state:', {
        isRazorpayLoaded: paymentState.razorpayLoaded,
        razorpayError: paymentState.razorpayError,
        isRazorpayLoading
      });
      
      setPaymentError(null);
      const result = await dispatch(completePaymentFlowThunk(orderData));
      console.log('🔍 completePaymentFlow result:', result);
      return result;
    } catch (error) {
      console.error('❌ completePaymentFlow error:', error);
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch, paymentState.razorpayLoaded, paymentState.razorpayError, isRazorpayLoading]);

  /**
   * Complete COD flow
   */
  const completeCODFlow = useCallback(async (orderData) => {
    try {
      setPaymentError(null);
      const result = await dispatch(completeCODFlowThunk(orderData));
      return result;
    } catch (error) {
      setPaymentError(error.message);
      throw error;
    }
  }, [dispatch]);

  /**
   * Clear all payment errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearPaymentErrors());
    setPaymentError(null);
  }, [dispatch]);

  /**
   * Clear all payment data
   */
  const clearData = useCallback(() => {
    dispatch(clearPaymentData());
    setPaymentError(null);
  }, [dispatch]);

  /**
   * Set current payment
   */
  const setPayment = useCallback((paymentData) => {
    dispatch(setCurrentPayment(paymentData));
  }, [dispatch]);

  /**
   * Reset current payment
   */
  const resetPayment = useCallback(() => {
    dispatch(resetCurrentPayment());
    setPaymentError(null);
  }, [dispatch]);

  /**
   * Set current order
   */
  const setOrder = useCallback((orderData) => {
    dispatch(setCurrentOrder(orderData));
  }, [dispatch]);

  /**
   * Clear current order
   */
  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  // Computed values
  const isLoading = 
    paymentState.paymentOrderLoading ||
    paymentState.verificationLoading ||
    paymentState.codOrderLoading ||
    isRazorpayLoading;

  const hasError = 
    paymentState.paymentOrderError ||
    paymentState.verificationError ||
    paymentState.codOrderError ||
    paymentState.razorpayError ||
    paymentError;

  const errorMessage = 
    paymentState.paymentOrderError ||
    paymentState.verificationError ||
    paymentState.codOrderError ||
    paymentState.razorpayError ||
    paymentError;

  const isPaymentSuccess = paymentState.currentPayment.status === 'success';
  const isPaymentFailed = paymentState.currentPayment.status === 'failed';
  const isPaymentLoading = paymentState.currentPayment.status === 'loading';

  return {
    // State
    paymentState,
    isLoading,
    hasError,
    errorMessage,
    isRazorpayLoaded: paymentState.razorpayLoaded,
    
    // Payment status
    isPaymentSuccess,
    isPaymentFailed,
    isPaymentLoading,
    
    // Current data
    currentPayment: paymentState.currentPayment,
    currentOrder: paymentState.currentOrder,
    
    // Actions
    createPaymentOrder,
    verifyPayment,
    createCODOrder,
    getPaymentHistory,
    getPaymentDetails,
    cancelPaymentOrder,
    completePaymentFlow,
    completeCODFlow,
    
    // Utility actions
    clearErrors,
    clearData,
    setPayment,
    resetPayment,
    setOrder,
    clearOrder
  };
};

/**
 * Custom hook for Razorpay integration
 */
export const useRazorpay = () => {
  const { isRazorpayLoaded, hasError, errorMessage } = usePayment();
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Initialize Razorpay payment
   */
  const initializePayment = useCallback(async (orderData, onSuccess, onError) => {
    if (!isRazorpayLoaded) {
      const error = 'Razorpay not loaded';
      onError?.(error);
      throw new Error(error);
    }

    if (!window.Razorpay) {
      const error = 'Razorpay script not available';
      onError?.(error);
      throw new Error(error);
    }

    try {
      setIsInitializing(true);
      
      const options = getRazorpayOptions(orderData);
      
      // Add custom handlers
      options.handler = function (response) {
        onSuccess?.(response);
      };
      
      options.modal.ondismiss = function () {
        onError?.('Payment cancelled by user');
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      onError?.(error.message);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [isRazorpayLoaded]);

  return {
    isRazorpayLoaded,
    hasError,
    errorMessage,
    isInitializing,
    initializePayment
  };
};

export default usePayment;
