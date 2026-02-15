/**
 * Payment utility functions for frontend
 */

/**
 * Format amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: INR)
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount, currency = 'INR') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Convert amount from paise to rupees
 * @param {number} amountInPaise - Amount in paise
 * @returns {number} Amount in rupees
 */
export const convertToRupees = (amountInPaise) => {
  if (typeof amountInPaise !== 'number' || isNaN(amountInPaise)) {
    return 0;
  }
  return amountInPaise / 100;
};

/**
 * Convert amount from rupees to paise
 * @param {number} amountInRupees - Amount in rupees
 * @returns {number} Amount in paise
 */
export const convertToPaise = (amountInRupees) => {
  if (typeof amountInRupees !== 'number' || isNaN(amountInRupees)) {
    return 0;
  }
  return Math.round(amountInRupees * 100);
};

/**
 * Calculate tax amount
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default: 18%)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, taxRate = 18) => {
  if (typeof subtotal !== 'number' || isNaN(subtotal)) {
    return 0;
  }
  return Math.round((subtotal * taxRate) / 100);
};

/**
 * Calculate total amount including tax
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default: 18%)
 * @returns {number} Total amount including tax
 */
export const calculateTotal = (subtotal, taxRate = 18) => {
  const taxAmount = calculateTax(subtotal, taxRate);
  return subtotal + taxAmount;
};

/**
 * Validate payment amount
 * @param {number} amount - Amount to validate
 * @returns {Object} Validation result
 */
export const validateAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return {
      isValid: false,
      error: 'Amount must be a valid number'
    };
  }

  if (amount <= 0) {
    return {
      isValid: false,
      error: 'Amount must be greater than zero'
    };
  }

  if (amount > 1000000) { // 10 lakh rupees
    return {
      isValid: false,
      error: 'Amount cannot exceed ₹10,00,000'
    };
  }

  return {
    isValid: true,
    amount: Math.round(amount)
  };
};

/**
 * Validate UPI ID format
 * @param {string} upiId - UPI ID to validate
 * @returns {boolean} Validation result
 */
export const validateUpiId = (upiId) => {
  if (!upiId || typeof upiId !== 'string') {
    return false;
  }

  // UPI ID format: user@bank or user@upi
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
  return upiRegex.test(upiId);
};

/**
 * Validate phone number for Indian format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Validation result
 */
export const validateIndianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all non-digits
  const cleanedPhone = phone.replace(/\D/g, '');

  // Indian phone number: 10 digits starting with 6-9
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  return indianPhoneRegex.test(cleanedPhone);
};

/**
 * Get payment method display name
 * @param {string} method - Payment method code
 * @returns {string} Display name
 */
export const getPaymentMethodDisplayName = (method) => {
  const methodNames = {
    'card': 'Credit/Debit Card',
    'upi': 'UPI',
    'netbanking': 'Net Banking',
    'wallet': 'Wallet',
    'emi': 'EMI',
    'cod': 'Cash on Delivery'
  };

  return methodNames[method] || method;
};

/**
 * Get payment status display name
 * @param {string} status - Payment status
 * @returns {string} Display name
 */
export const getPaymentStatusDisplayName = (status) => {
  const statusNames = {
    'created': 'Order Created',
    'attempted': 'Payment Attempted',
    'paid': 'Payment Successful',
    'failed': 'Payment Failed',
    'cancelled': 'Payment Cancelled'
  };

  return statusNames[status] || status;
};

/**
 * Get payment status color for UI
 * @param {string} status - Payment status
 * @returns {string} CSS color class
 */
export const getPaymentStatusColor = (status) => {
  const statusColors = {
    'created': 'text-blue-600',
    'attempted': 'text-yellow-600',
    'paid': 'text-green-600',
    'failed': 'text-red-600',
    'cancelled': 'text-gray-600'
  };

  return statusColors[status] || 'text-gray-600';
};

/**
 * Get payment status background color for UI
 * @param {string} status - Payment status
 * @returns {string} CSS background color class
 */
export const getPaymentStatusBgColor = (status) => {
  const statusBgColors = {
    'created': 'bg-blue-100',
    'attempted': 'bg-yellow-100',
    'paid': 'bg-green-100',
    'failed': 'bg-red-100',
    'cancelled': 'bg-gray-100'
  };

  return statusBgColors[status] || 'bg-gray-100';
};

/**
 * Mask sensitive payment data
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of characters to show at start
 * @param {number} visibleEndChars - Number of characters to show at end
 * @returns {string} Masked data
 */
export const maskSensitiveData = (data, visibleChars = 4, visibleEndChars = 4) => {
  if (!data || data.length <= visibleChars + visibleEndChars) {
    return data;
  }

  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleEndChars);
  const middle = '*'.repeat(data.length - visibleChars - visibleEndChars);

  return start + middle + end;
};

/**
 * Generate order summary text
 * @param {Array} services - Services array
 * @returns {string} Order summary
 */
export const generateOrderSummary = (services) => {
  if (!services || services.length === 0) {
    return 'No services selected';
  }

  if (services.length === 1) {
    return services[0].name;
  }

  if (services.length === 2) {
    return `${services[0].name} and ${services[1].name}`;
  }

  return `${services[0].name} and ${services.length - 1} other services`;
};

/**
 * Parse duration to minutes (handles "1hr 10mins", "60", 60, etc.)
 * @param {string|number} duration - Duration as string ("1hr 10mins", "60") or number
 * @returns {number} Duration in minutes
 */
export const parseDurationToMinutes = (duration) => {
  if (duration == null || duration === '') {
    return 60;
  }
  if (typeof duration === 'number' && !Number.isNaN(duration)) {
    return Math.max(15, Math.round(duration));
  }
  const str = String(duration).trim().toLowerCase();
  if (!str) return 60;

  let totalMinutes = 0;

  // Match hours: "1hr", "1 hr", "2hours"
  const hrMatch = str.match(/(\d+)\s*(?:hr|hour)s?/);
  if (hrMatch) {
    totalMinutes += parseInt(hrMatch[1], 10) * 60;
  }

  // Match minutes: "10mins", "10 min", "5minutes"
  const minMatch = str.match(/(\d+)\s*(?:min|mins|minute)s?/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1], 10);
  }

  // If no hr/min pattern matched, try plain number (e.g. "60", "70")
  if (totalMinutes === 0) {
    const num = parseInt(str, 10);
    if (!Number.isNaN(num)) {
      totalMinutes = num;
    } else {
      return 60;
    }
  }

  return Math.max(15, totalMinutes);
};

/**
 * Calculate service duration in minutes
 * @param {Array} services - Services array
 * @returns {number} Total duration in minutes
 */
export const calculateServiceDuration = (services) => {
  if (!services || services.length === 0) {
    return 0;
  }

  return services.reduce((total, service) => {
    const duration = parseDurationToMinutes(service.duration);
    return total + (duration * service.quantity);
  }, 0);
};

/**
 * Format duration for display
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    return '0 min';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Format time for display
 * @param {string} time - Time to format
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';

  // If time is in format like "09:00 AM", return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }

  // If time is in 24-hour format, convert to 12-hour
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Check if payment is in terminal state
 * @param {string} status - Payment status
 * @returns {boolean} True if terminal state
 */
export const isTerminalPaymentStatus = (status) => {
  const terminalStatuses = ['paid', 'failed', 'cancelled'];
  return terminalStatuses.includes(status);
};

/**
 * Get Razorpay configuration
 * @param {Object} orderData - Order data
 * @returns {Object} Razorpay options
 */
export const getRazorpayOptions = (orderData) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  console.log('🔍 Razorpay key check:', {
    key: razorpayKey,
    keyType: typeof razorpayKey,
    keyLength: razorpayKey ? razorpayKey.length : 0,
    isTestKey: razorpayKey ? razorpayKey.startsWith('rzp_test_') : false,
    isLiveKey: razorpayKey ? razorpayKey.startsWith('rzp_live_') : false
  });

  if (!razorpayKey) {
    throw new Error('Razorpay key not configured. Please check VITE_RAZORPAY_KEY_ID in .env file');
  }

  const options = {
    key: razorpayKey,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    name: 'Makeover',
    description: 'Beauty Services Booking',
    order_id: orderData.orderId,
    prefill: {
      name: orderData.customer?.name || 'Customer',
      email: orderData.customer?.email || '',
      contact: orderData.customer?.phone || ''
    },
    notes: {
      // Temporarily remove date info to test if it's causing Razorpay issues
      // booking_date: orderData.bookingDetails?.date,
      // booking_slot: orderData.bookingDetails?.slot,
      services_count: orderData.services?.length || 0,
      booking_info: orderData.bookingDetails?.date && orderData.bookingDetails?.slot 
        ? `Service booking for ${orderData.bookingDetails.date} at ${orderData.bookingDetails.slot}` 
        : 'Beauty service booking'
    },
    theme: {
      color: '#CC2B52'
    },
    modal: {
      ondismiss: function() {
        console.log('🔍 Payment modal dismissed by user');
      }
    },
    // Add retry configuration
    retry: {
      enabled: true,
      max_count: 3
    },
    // Add timeout
    timeout: 300,
    // Add reminder
    reminder: {
      enabled: true,
      period: 1
    }
  };

  console.log('🔍 Final Razorpay options:', options);
  return options;
};

/**
 * Load Razorpay script dynamically
 * @returns {Promise} Promise that resolves when script is loaded
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    console.log('🔍 Loading Razorpay script...');
    
    if (window.Razorpay) {
      console.log('✅ Razorpay already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      console.log('🔍 Window.Razorpay available:', !!window.Razorpay);
      resolve();
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Razorpay script:', error);
      reject(new Error('Failed to load Razorpay script'));
    };

    console.log('📡 Adding Razorpay script to document head...');
    document.head.appendChild(script);
  });
};

/**
 * Validate booking date
 * @param {string|Date} date - Date to validate
 * @returns {Object} Validation result
 */
export const validateBookingDate = (date) => {
  if (!date) {
    return {
      isValid: false,
      error: 'Booking date is required'
    };
  }

  const bookingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(bookingDate.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format'
    };
  }

  if (bookingDate < today) {
    return {
      isValid: false,
      error: 'Booking date cannot be in the past'
    };
  }

  // Check if date is more than 30 days in future
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  if (bookingDate > maxDate) {
    return {
      isValid: false,
      error: 'Booking date cannot be more than 30 days in future'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Validate booking slot
 * @param {string} slot - Time slot to validate
 * @returns {Object} Validation result
 */
export const validateBookingSlot = (slot) => {
  if (!slot) {
    return {
      isValid: false,
      error: 'Booking slot is required'
    };
  }

  // Basic validation for time format
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  
  if (!timeRegex.test(slot)) {
    return {
      isValid: false,
      error: 'Invalid time slot format'
    };
  }

  return {
    isValid: true
  };
};
