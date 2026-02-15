import axios from 'axios';

const backendurl = import.meta.env.VITE_BACKEND_URL;

const adminContactMessagesApiInstance = axios.create({
  baseURL: `${backendurl}/api/admin/contact-messages`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

adminContactMessagesApiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
    }
    if (error.response?.status === 403) {
      const msg = error.response?.data?.message || '';
      if (msg.toLowerCase().includes('deactivated') || msg.toLowerCase().includes('inactive')) {
        if (window.showAdminDeactivatedModal) {
          window.showAdminDeactivatedModal();
        } else {
          window.location.href = '/auth/login';
        }
        return Promise.reject(new Error(msg));
      }
      window.location.href = '/';
    }
    return Promise.reject(new Error(error.response?.data?.message || 'Failed to fetch contact messages'));
  }
);

export const adminContactMessagesApi = {
  getAll: (params = {}) => adminContactMessagesApiInstance.get('/', { params }),
};
