import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminCustomersApi } from './adminCustomersApi';

/**
 * Fetch all customers with search and pagination
 */
export const fetchAllCustomers = createAsyncThunk(
  'adminCustomers/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminCustomersApi.getAllCustomers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);
