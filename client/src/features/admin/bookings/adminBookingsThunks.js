import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminBookingsApi } from './adminBookingsApi';

/**
 * Fetch all bookings with filters, search, and pagination
 */
export const fetchAllBookings = createAsyncThunk(
  'adminBookings/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminBookingsApi.getAllBookings(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch bookings');
    }
  }
);

/**
 * Fetch single booking details by ID
 */
export const fetchBookingById = createAsyncThunk(
  'adminBookings/fetchById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await adminBookingsApi.getBookingById(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch booking details');
    }
  }
);
