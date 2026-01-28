import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminReviewsApi } from './adminReviewsApi';

/**
 * Fetch all reviews/complaints
 */
export const fetchAllReviews = createAsyncThunk(
  'adminReviews/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminReviewsApi.getAllReviews(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);
