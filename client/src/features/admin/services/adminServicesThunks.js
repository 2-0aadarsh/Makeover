import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminServicesApi } from './adminServicesApi';

/**
 * Fetch all services
 */
export const fetchAllServices = createAsyncThunk(
  'adminServices/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminServicesApi.getAllServices(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

/**
 * Fetch services by category
 */
export const fetchServicesByCategory = createAsyncThunk(
  'adminServices/fetchByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await adminServicesApi.getServicesByCategory(categoryId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch services by category');
    }
  }
);

/**
 * Fetch service by ID
 */
export const fetchServiceById = createAsyncThunk(
  'adminServices/fetchById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await adminServicesApi.getServiceById(serviceId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch service');
    }
  }
);

/**
 * Delete service
 */
export const deleteServiceThunk = createAsyncThunk(
  'adminServices/delete',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await adminServicesApi.deleteService(serviceId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete service');
    }
  }
);
