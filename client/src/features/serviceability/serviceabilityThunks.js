import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getServiceableCities,
  checkCityServiceability as checkCityServiceabilityApi,
  checkLocationServiceability as checkLocationServiceabilityApi
} from './serviceabilityApi';

/**
 * Fetch all serviceable cities
 */
export const fetchServiceableCities = createAsyncThunk(
  'serviceability/fetchCities',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🔍 [Serviceability Thunk] Fetching serviceable cities...');
      
      // Check if we should use cache
      const state = getState();
      const lastFetched = state.serviceability.citiesLastFetched;
      const cacheExpiry = state.serviceability.cacheExpiry;
      
      if (lastFetched) {
        const elapsed = Date.now() - lastFetched;
        if (elapsed < cacheExpiry) {
          console.log('✅ [Serviceability Thunk] Using cached cities');
          return state.serviceability.cities;
        }
      }
      
      // Fetch from API
      const response = await getServiceableCities();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch serviceable cities');
      }
      
      console.log(`✅ [Serviceability Thunk] Fetched ${response.data.length} cities`);
      return response.data;
    } catch (error) {
      console.error('❌ [Serviceability Thunk] Error fetching cities:', error);
      return rejectWithValue(error.message || 'Failed to fetch serviceable cities');
    }
  }
);

/**
 * Check if a specific city is serviceable
 */
export const checkCityServiceability = createAsyncThunk(
  'serviceability/checkCity',
  async (city, { rejectWithValue }) => {
    try {
      console.log('🔍 [Serviceability Thunk] Checking city:', city);
      
      if (!city || typeof city !== 'string' || city.trim() === '') {
        throw new Error('Please provide a valid city name');
      }
      
      const response = await checkCityServiceabilityApi(city.trim());
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to check city serviceability');
      }
      
      console.log(`✅ [Serviceability Thunk] ${city} is ${response.data.isServiceable ? 'SERVICEABLE' : 'NOT SERVICEABLE'}`);
      return response.data;
    } catch (error) {
      console.error('❌ [Serviceability Thunk] Error checking city:', error);
      return rejectWithValue(error.message || 'Failed to check city serviceability');
    }
  }
);

/**
 * Check if both city and pincode are serviceable
 */
export const checkLocationServiceability = createAsyncThunk(
  'serviceability/checkLocation',
  async ({ city, pincode }, { rejectWithValue }) => {
    try {
      console.log('🔍 [Serviceability Thunk] Checking location:', { city, pincode });
      
      if (!city || typeof city !== 'string' || city.trim() === '') {
        throw new Error('Please provide a valid city name');
      }
      
      if (!pincode || typeof pincode !== 'string' || pincode.trim() === '') {
        throw new Error('Please provide a valid pincode');
      }
      
      const response = await checkLocationServiceabilityApi(city.trim(), pincode.trim());
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to check location serviceability');
      }
      
      console.log(`✅ [Serviceability Thunk] ${city} (${pincode}) is ${response.data.isServiceable ? 'SERVICEABLE' : 'NOT SERVICEABLE'}`);
      return response.data;
    } catch (error) {
      console.error('❌ [Serviceability Thunk] Error checking location:', error);
      return rejectWithValue(error.message || 'Failed to check location serviceability');
    }
  }
);

export default {
  fetchServiceableCities,
  checkCityServiceability,
  checkLocationServiceability
};



