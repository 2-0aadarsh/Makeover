import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminDashboardApi } from './adminDashboardApi';

/**
 * Fetch dashboard metrics (Total Users, Total Bookings, Total Revenue, Upcoming Bookings)
 */
export const fetchDashboardMetrics = createAsyncThunk(
  'adminDashboard/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminDashboardApi.getDashboardMetrics();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard metrics');
    }
  }
);

/**
 * Fetch today's bookings with pagination
 * @param {Object} params - { page, limit, status }
 */
export const fetchTodayBookings = createAsyncThunk(
  'adminDashboard/fetchTodayBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminDashboardApi.getTodayBookings(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch today\'s bookings');
    }
  }
);

/**
 * Fetch recent activity (bookings, enquiries, users)
 * @param {Object} params - { limit }
 */
export const fetchRecentActivity = createAsyncThunk(
  'adminDashboard/fetchRecentActivity',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminDashboardApi.getRecentActivity(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recent activity');
    }
  }
);

/**
 * Fetch dashboard statistics (booking status breakdown, payment status, monthly revenue)
 */
export const fetchDashboardStats = createAsyncThunk(
  'adminDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminDashboardApi.getDashboardStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard statistics');
    }
  }
);
