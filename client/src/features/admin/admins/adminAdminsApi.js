import axios from 'axios';
const backendurl = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const adminAdminsApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/admins`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor for error handling
adminAdminsApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      // Check if admin account is deactivated
      if (errorMessage.toLowerCase().includes('deactivated') || errorMessage.toLowerCase().includes('inactive')) {
        // Show custom modal instead of browser alert
        if (window.showAdminDeactivatedModal) {
          window.showAdminDeactivatedModal();
        } else {
          // Fallback if modal not ready yet
          window.location.href = '/auth/login';
        }
        return Promise.reject(new Error(errorMessage));
      }
      // Other 403 errors (not admin) - redirect to home
      window.location.href = '/';
    }
    // Extract detailed error message from backend
    const errorData = error.response?.data;
    let errorMessage = 'An error occurred';
    
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.join(', ');
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Admin Admins API functions
export const adminAdminsApi = {
  /**
   * Get all admins with search and pagination
   * @param {Object} params - { page, limit, search, status, sortBy, sortOrder }
   * @returns {Promise} Admins data with pagination
   */
  getAllAdmins: (params = {}) => {
    return adminAdminsApiInstance.get('/', { params });
  },

  /**
   * Get admin statistics
   * @returns {Promise} Admin statistics
   */
  getAdminStats: () => {
    return adminAdminsApiInstance.get('/stats');
  },

  /**
   * Get admin details by ID
   * @param {string} adminId - Admin ID
   * @returns {Promise} Admin details
   */
  getAdminById: (adminId) => {
    return adminAdminsApiInstance.get(`/${adminId}`);
  },

  /**
   * Create new admin
   * @param {Object} data - { name, email, password, confirmPassword }
   * @returns {Promise} Created admin data
   */
  createAdmin: (data) => {
    return adminAdminsApiInstance.post('/', data);
  },

  /**
   * Update admin
   * @param {string} adminId - Admin ID
   * @param {Object} data - { name?, email?, isActive? }
   * @returns {Promise} Updated admin data
   */
  updateAdmin: (adminId, data) => {
    return adminAdminsApiInstance.put(`/${adminId}`, data);
  },

  /**
   * Reset admin password
   * @param {string} adminId - Admin ID
   * @param {Object} data - { password, confirmPassword }
   * @returns {Promise} Success message
   */
  resetAdminPassword: (adminId, data) => {
    return adminAdminsApiInstance.patch(`/${adminId}/password`, data);
  },

  /**
   * Toggle admin status
   * @param {string} adminId - Admin ID
   * @returns {Promise} Updated admin data
   */
  toggleAdminStatus: (adminId) => {
    return adminAdminsApiInstance.patch(`/${adminId}/toggle-status`);
  },

  /**
   * Delete admin
   * @param {string} adminId - Admin ID
   * @returns {Promise} Success message
   */
  deleteAdmin: (adminId) => {
    return adminAdminsApiInstance.delete(`/${adminId}`);
  },

  /**
   * Get onboarding status for an admin
   * @param {string} adminId - Admin ID
   * @returns {Promise} Onboarding status
   */
  getOnboardingStatus: (adminId) => {
    return adminAdminsApiInstance.get(`/${adminId}/onboarding-status`);
  },

  /**
   * Resend onboarding link
   * @param {string} adminId - Admin ID
   * @returns {Promise} Success message
   */
  resendOnboardingLink: (adminId) => {
    return adminAdminsApiInstance.post(`/${adminId}/resend-onboarding-link`);
  },

  /**
   * Invalidate onboarding link
   * @param {string} adminId - Admin ID
   * @returns {Promise} Success message
   */
  invalidateOnboardingLink: (adminId) => {
    return adminAdminsApiInstance.post(`/${adminId}/invalidate-onboarding-link`);
  },
};

// Onboarding API (public, token-based)
const onboardingApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/onboard`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

onboardingApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data;
    let errorMessage = 'An error occurred';
    
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    } else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const onboardingApi = {
  /**
   * Validate onboarding token
   * @param {string} token - Onboarding token
   * @returns {Promise} Admin details if token is valid
   */
  validateToken: (token) => {
    return onboardingApiInstance.get('/', { params: { token } });
  },

  /**
   * Complete onboarding (set password)
   * @param {Object} data - { token, password, confirmPassword }
   * @returns {Promise} Success message
   */
  completeOnboarding: (data) => {
    return onboardingApiInstance.post('/', data);
  },
};
