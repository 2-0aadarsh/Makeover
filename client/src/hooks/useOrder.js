import { useState, useCallback } from "react";
import { validateOrderData, formatOrderForAPI, generateOrderId } from "../utils/orderUtils";

/**
 * Custom hook for managing order state and operations
 */
export const useOrder = (initialOrderData = {}) => {
  const [orderData, setOrderData] = useState(initialOrderData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [orderId, setOrderId] = useState(null);

  /**
   * Update order data
   */
  const updateOrderData = useCallback((updates) => {
    setOrderData(prev => ({
      ...prev,
      ...updates
    }));
    // Clear errors when data is updated
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  /**
   * Add or update a service
   */
  const addService = useCallback((service) => {
    setOrderData(prev => {
      const existingServiceIndex = prev.services?.findIndex(s => s.id === service.id) ?? -1;
      
      if (existingServiceIndex >= 0) {
        // Update existing service
        const updatedServices = [...prev.services];
        updatedServices[existingServiceIndex] = service;
        return { ...prev, services: updatedServices };
      } else {
        // Add new service
        const services = prev.services || [];
        return { ...prev, services: [...services, service] };
      }
    });
  }, []);

  /**
   * Remove a service
   */
  const removeService = useCallback((serviceId) => {
    setOrderData(prev => ({
      ...prev,
      services: prev.services?.filter(s => s.id !== serviceId) || []
    }));
  }, []);

  /**
   * Add or update an addon
   */
  const addAddon = useCallback((addon) => {
    setOrderData(prev => {
      const existingAddonIndex = prev.addons?.findIndex(a => a.id === addon.id) ?? -1;
      
      if (existingAddonIndex >= 0) {
        // Update existing addon
        const updatedAddons = [...prev.addons];
        updatedAddons[existingAddonIndex] = addon;
        return { ...prev, addons: updatedAddons };
      } else {
        // Add new addon
        const addons = prev.addons || [];
        return { ...prev, addons: [...addons, addon] };
      }
    });
  }, []);

  /**
   * Remove an addon
   */
  const removeAddon = useCallback((addonId) => {
    setOrderData(prev => ({
      ...prev,
      addons: prev.addons?.filter(a => a.id !== addonId) || []
    }));
  }, []);

  /**
   * Validate order data
   */
  const validateOrder = useCallback(() => {
    const validation = validateOrderData(orderData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [orderData]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Reset order data to initial state
   */
  const resetOrder = useCallback(() => {
    setOrderData(initialOrderData);
    setErrors([]);
    setOrderId(null);
  }, [initialOrderData]);

  /**
   * Create order (submit to API)
   */
  const createOrder = useCallback(async (apiFunction) => {
    if (!validateOrder()) {
      return { success: false, errors };
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const formattedOrder = formatOrderForAPI(orderData);
      const generatedId = generateOrderId();
      
      // Add order ID to the data
      const orderWithId = {
        ...formattedOrder,
        orderId: generatedId
      };

      // Call API function (passed as parameter)
      const response = await apiFunction(orderWithId);
      
      if (response.success) {
        setOrderId(generatedId);
        return { success: true, orderId: generatedId, data: response.data };
      } else {
        setErrors(response.errors || ['Failed to create order']);
        return { success: false, errors: response.errors || ['Failed to create order'] };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setErrors([errorMessage]);
      return { success: false, errors: [errorMessage] };
    } finally {
      setIsLoading(false);
    }
  }, [orderData, errors, validateOrder]);

  /**
   * Get order summary for display
   */
  const getOrderSummary = useCallback(() => {
    const services = orderData.services || [];
    const addons = orderData.addons || [];
    
    return {
      totalServices: services.length,
      totalAddons: addons.length,
      servicesTotal: services.reduce((sum, s) => sum + (s.price || 0), 0),
      addonsTotal: addons.reduce((sum, a) => sum + (a.price || 0), 0),
      grandTotal: services.reduce((sum, s) => sum + (s.price || 0), 0) + 
                  addons.reduce((sum, a) => sum + (a.price || 0), 0)
    };
  }, [orderData.services, orderData.addons]);

  /**
   * Check if order is complete (has all required fields)
   */
  const isOrderComplete = useCallback(() => {
    return validateOrderData(orderData).isValid;
  }, [orderData]);

  /**
   * Get formatted order data for display
   */
  const getFormattedOrderData = useCallback(() => {
    return {
      ...orderData,
      orderId: orderId || generateOrderId(),
      summary: getOrderSummary()
    };
  }, [orderData, orderId, getOrderSummary]);

  return {
    // State
    orderData,
    isLoading,
    errors,
    orderId,
    
    // Actions
    updateOrderData,
    addService,
    removeService,
    addAddon,
    removeAddon,
    validateOrder,
    clearErrors,
    resetOrder,
    createOrder,
    
    // Computed values
    getOrderSummary,
    isOrderComplete,
    getFormattedOrderData
  };
};
