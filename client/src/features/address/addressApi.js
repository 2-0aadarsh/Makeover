import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const addressApi = axios.create({
  baseURL: `${API_BASE_URL}/api/addresses`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add response interceptor for error handling
addressApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Address request failed';
    return Promise.reject(new Error(message));
  }
);

// Address API functions
export const getUserAddresses = () => {
  return addressApi.get('/');
};

export const getAddressById = (addressId) => {
  return addressApi.get(`/${addressId}`);
};

export const getDefaultAddress = () => {
  return addressApi.get('/default');
};

export const createAddress = (addressData) => {
  return addressApi.post('/', addressData);
};

export const updateAddress = (addressId, addressData) => {
  return addressApi.put(`/${addressId}`, addressData);
};

export const deleteAddress = (addressId) => {
  return addressApi.delete(`/${addressId}`);
};

export const setDefaultAddress = (addressId) => {
  return addressApi.patch(`/${addressId}/default`);
};

export const getAddressStats = () => {
  return addressApi.get('/stats');
};

export const restoreAddress = (addressId) => {
  return addressApi.post(`/${addressId}/restore`);
};

export const permanentlyDeleteAddress = (addressId) => {
  return addressApi.delete(`/${addressId}/permanent`);
};

export const checkAddressStatus = () => {
  return addressApi.get('/debug');
};






