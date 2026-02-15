import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminAdminsApi } from './adminAdminsApi';

/**
 * Fetch all admins with search and pagination
 */
export const fetchAllAdmins = createAsyncThunk(
  'adminAdmins/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.getAllAdmins(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admins');
    }
  }
);

/**
 * Fetch admin statistics
 */
export const fetchAdminStats = createAsyncThunk(
  'adminAdmins/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.getAdminStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin statistics');
    }
  }
);

/**
 * Fetch admin by ID
 */
export const fetchAdminById = createAsyncThunk(
  'adminAdmins/fetchById',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.getAdminById(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin');
    }
  }
);

/**
 * Create new admin
 */
export const createAdmin = createAsyncThunk(
  'adminAdmins/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.createAdmin(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create admin');
    }
  }
);

/**
 * Update admin
 */
export const updateAdmin = createAsyncThunk(
  'adminAdmins/update',
  async ({ adminId, data }, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.updateAdmin(adminId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update admin');
    }
  }
);

/**
 * Reset admin password
 */
export const resetAdminPassword = createAsyncThunk(
  'adminAdmins/resetPassword',
  async ({ adminId, data }, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.resetAdminPassword(adminId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

/**
 * Toggle admin status
 */
export const toggleAdminStatus = createAsyncThunk(
  'adminAdmins/toggleStatus',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.toggleAdminStatus(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle admin status');
    }
  }
);

/**
 * Delete admin
 */
export const deleteAdmin = createAsyncThunk(
  'adminAdmins/delete',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.deleteAdmin(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete admin');
    }
  }
);

/**
 * Get onboarding status
 */
export const getOnboardingStatus = createAsyncThunk(
  'adminAdmins/getOnboardingStatus',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.getOnboardingStatus(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get onboarding status');
    }
  }
);

/**
 * Resend onboarding link
 */
export const resendOnboardingLink = createAsyncThunk(
  'adminAdmins/resendOnboardingLink',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.resendOnboardingLink(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to resend onboarding link');
    }
  }
);

/**
 * Invalidate onboarding link
 */
export const invalidateOnboardingLink = createAsyncThunk(
  'adminAdmins/invalidateOnboardingLink',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await adminAdminsApi.invalidateOnboardingLink(adminId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to invalidate onboarding link');
    }
  }
);
