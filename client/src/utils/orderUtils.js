/**
 * Format price to INR currency format
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time to 12-hour format
 * @param {string} timeString - Time string in HH:MM format
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Generate a unique order ID
 * @returns {string} Order ID
 */
export const generateOrderId = () => {
  const prefix = "MAK";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Calculate total amount from services
 * @param {Array} services - Array of service objects with price and quantity
 * @returns {number} Total amount
 */
export const calculateTotal = (services) => {
  return services.reduce((sum, service) => {
    return sum + (service.price * service.quantity);
  }, 0);
};

/**
 * Share order details
 * @param {Object} orderData - Order data object
 * @returns {Promise} Promise that resolves when sharing is complete
 */
export const shareOrder = async (orderData) => {
  if (navigator.share) {
    return navigator.share({
      title: `Makeover Order #${orderData?.orderId}`,
      text: `Check out my booking with Makeover! Order #${orderData?.orderId}`,
      url: window.location.href,
    });
  } else {
    throw new Error("Sharing is not supported in your browser");
  }
};

/**
 * Save order to local storage
 * @param {Object} orderData - Order data object
 */
export const saveOrderToLocalStorage = (orderData) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('makeover_orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('makeover_orders', JSON.stringify(existingOrders));
  } catch (error) {
    console.error("Error saving order to local storage:", error);
  }
};

/**
 * Get all orders from local storage
 * @returns {Array} Array of order objects
 */
export const getOrdersFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('makeover_orders') || '[]');
  } catch (error) {
    console.error("Error getting orders from local storage:", error);
    return [];
  }
};

/**
 * Get order by ID from local storage
 * @param {string} orderId - Order ID
 * @returns {Object|null} Order object or null if not found
 */
export const getOrderById = (orderId) => {
  try {
    const orders = getOrdersFromLocalStorage();
    return orders.find(order => order.orderId === orderId) || null;
  } catch (error) {
    console.error("Error getting order by ID:", error);
    return null;
  }
};