import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminEnquiriesApi } from './adminEnquiriesApi';

/**
 * Fetch all enquiries with filters, search, and pagination
 */
export const fetchAllEnquiries = createAsyncThunk(
  'adminEnquiries/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminEnquiriesApi.getAllEnquiries(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch enquiries');
    }
  }
);
