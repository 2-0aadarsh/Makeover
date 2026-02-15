import axios from "axios";
const backendurl = import.meta.env.VITE_BACKEND_URL;

/**
 * Notifications API - User notification management
 */

// Axios instance with credentials
const notificationsApiInstance = axios.create({
  baseURL: `${backendurl}/api/notifications`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
notificationsApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || "An error occurred with notifications";
    console.error("Notifications API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export const notificationsApi = {
  /**
   * Get notifications for current user (paginated)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {boolean} params.unreadOnly - Filter to unread only
   * @returns {Promise} Notifications with pagination
   */
  getNotifications: (params = {}) => {
    return notificationsApiInstance.get("/", { params });
  },

  /**
   * Get unread notification count
   * @returns {Promise} Object with unreadCount
   */
  getUnreadCount: () => {
    return notificationsApiInstance.get("/unread-count");
  },

  /**
   * Get pending review request notifications
   * @returns {Promise} Review request notifications
   */
  getReviewRequests: () => {
    return notificationsApiInstance.get("/review-requests");
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markAsRead: (notificationId) => {
    return notificationsApiInstance.patch(`/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Result with modified count
   */
  markAllAsRead: () => {
    return notificationsApiInstance.patch("/mark-all-read");
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Deletion result
   */
  deleteNotification: (notificationId) => {
    return notificationsApiInstance.delete(`/${notificationId}`);
  },
};

export default notificationsApi;
