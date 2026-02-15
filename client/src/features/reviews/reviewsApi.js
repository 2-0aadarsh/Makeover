import axios from "axios";
const backendurl = import.meta.env.VITE_BACKEND_URL;

/**
 * Reviews API - User-facing endpoints for review management
 */

// Axios instance with credentials
const reviewsApiInstance = axios.create({
  baseURL: `${backendurl}/api/reviews`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
reviewsApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || "An error occurred with reviews";
    console.error("Reviews API Error:", errorMessage);
    return Promise.reject(error);
  }
);

export const reviewsApi = {
  /**
   * Verify review token from email link
   * @param {string} token - Review token
   * @returns {Promise} Booking details if token is valid
   */
  verifyToken: (token) => {
    return reviewsApiInstance.get(`/verify-token/${token}`);
  },

  /**
   * Submit a review or complaint
   * @param {Object} reviewData - Review submission data
   * @param {string} reviewData.token - Review token (optional)
   * @param {string} reviewData.bookingId - Booking ID (optional)
   * @param {string} reviewData.type - 'review' or 'complaint'
   * @param {number} reviewData.rating - Rating (0.5-5)
   * @param {string} reviewData.comment - Review text
   * @param {string} reviewData.complaintCategory - Category for complaints
   * @param {string} reviewData.source - 'email', 'web', or 'mobile'
   * @returns {Promise} Created review data
   */
  submitReview: (reviewData) => {
    return reviewsApiInstance.post("/", reviewData);
  },

  /**
   * Get bookings pending review for current user
   * @returns {Promise} List of bookings awaiting review
   */
  getPendingReviews: () => {
    return reviewsApiInstance.get("/pending");
  },

  /**
   * Get user's submitted reviews
   * @param {Object} params - Pagination parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} User's reviews with pagination
   */
  getMyReviews: (params = {}) => {
    return reviewsApiInstance.get("/my-reviews", { params });
  },

  /**
   * Get a specific review by ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} Review details
   */
  getReviewById: (reviewId) => {
    return reviewsApiInstance.get(`/${reviewId}`);
  },

  /**
   * Edit an existing review (within 48hr window)
   * @param {string} reviewId - Review ID
   * @param {Object} updates - Fields to update
   * @param {number} updates.rating - New rating
   * @param {string} updates.comment - New comment
   * @returns {Promise} Updated review
   */
  editReview: (reviewId, updates) => {
    return reviewsApiInstance.patch(`/${reviewId}`, updates);
  },

  /**
   * Get published testimonials for homepage (public, no auth)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Max testimonials (default 20, max 50)
   * @returns {Promise} { data: { testimonials, count } }
   */
  getTestimonials: (params = {}) => {
    return reviewsApiInstance.get("/testimonials", { params });
  },

  /**
   * Get testimonial statistics for homepage (public, no auth)
   * @returns {Promise} { data: { totalBookings, totalReviews, avgRating, satisfactionRate, citiesCount, citiesList, uniqueServices } }
   */
  getTestimonialStats: () => {
    return reviewsApiInstance.get("/testimonials/stats");
  },
};

export default reviewsApi;
