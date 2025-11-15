import { createSlice } from '@reduxjs/toolkit';
import {
  fetchServiceableCities,
  checkCityServiceability
} from './serviceabilityThunks';

/**
 * Serviceability Slice
 * 
 * Manages serviceable cities and city validation state
 */
const initialState = {
  // Serviceable cities data
  cities: [],
  citiesLoading: false,
  citiesError: null,
  citiesLastFetched: null,
  
  // City validation state
  currentCity: null,
  isServiceable: null,
  validationLoading: false,
  validationError: null,
  validationMessage: null,
  
  // Cache management
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

const serviceabilitySlice = createSlice({
  name: 'serviceability',
  initialState,
  reducers: {
    // Clear validation state
    clearValidation: (state) => {
      state.currentCity = null;
      state.isServiceable = null;
      state.validationError = null;
      state.validationMessage = null;
    },
    
    // Set current city being validated
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    
    // Clear all serviceability data
    clearServiceabilityData: (state) => {
      return initialState;
    },
    
    // Manual cache invalidation
    invalidateCache: (state) => {
      state.citiesLastFetched = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Serviceable Cities
    builder
      .addCase(fetchServiceableCities.pending, (state) => {
        state.citiesLoading = true;
        state.citiesError = null;
      })
      .addCase(fetchServiceableCities.fulfilled, (state, action) => {
        state.citiesLoading = false;
        state.cities = action.payload;
        state.citiesLastFetched = Date.now();
        state.citiesError = null;
        
        console.log('✅ [Serviceability Slice] Cities loaded:', state.cities.length);
      })
      .addCase(fetchServiceableCities.rejected, (state, action) => {
        state.citiesLoading = false;
        state.citiesError = action.payload || 'Failed to fetch serviceable cities';
        console.error('❌ [Serviceability Slice] Failed to fetch cities:', state.citiesError);
      });
    
    // Check City Serviceability
    builder
      .addCase(checkCityServiceability.pending, (state) => {
        state.validationLoading = true;
        state.validationError = null;
      })
      .addCase(checkCityServiceability.fulfilled, (state, action) => {
        state.validationLoading = false;
        state.currentCity = action.payload.requestedCity;
        state.isServiceable = action.payload.isServiceable;
        state.validationMessage = action.payload.message;
        state.validationError = null;
        
        console.log(`✅ [Serviceability Slice] Validation complete: ${action.payload.requestedCity} - ${action.payload.isServiceable ? 'SERVICEABLE' : 'NOT SERVICEABLE'}`);
      })
      .addCase(checkCityServiceability.rejected, (state, action) => {
        state.validationLoading = false;
        state.validationError = action.payload || 'Failed to check city serviceability';
        state.isServiceable = false;
        console.error('❌ [Serviceability Slice] Validation failed:', state.validationError);
      });
  },
});

// Actions
export const {
  clearValidation,
  setCurrentCity,
  clearServiceabilityData,
  invalidateCache
} = serviceabilitySlice.actions;

// Selectors
export const selectServiceableCities = (state) => state.serviceability.cities;
export const selectCitiesLoading = (state) => state.serviceability.citiesLoading;
export const selectCitiesError = (state) => state.serviceability.citiesError;

export const selectCurrentCity = (state) => state.serviceability.currentCity;
export const selectIsServiceable = (state) => state.serviceability.isServiceable;
export const selectValidationLoading = (state) => state.serviceability.validationLoading;
export const selectValidationError = (state) => state.serviceability.validationError;
export const selectValidationMessage = (state) => state.serviceability.validationMessage;

// Memoized selector: Check if cache is still valid
export const selectIsCacheValid = (state) => {
  if (!state.serviceability.citiesLastFetched) return false;
  
  const now = Date.now();
  const elapsed = now - state.serviceability.citiesLastFetched;
  return elapsed < state.serviceability.cacheExpiry;
};

// Helper selector: Get city names only
export const selectCityNames = (state) => 
  state.serviceability.cities.map(city => city.city);

// Helper selector: Get formatted display list
export const selectCitiesDisplay = (state) => {
  const cities = state.serviceability.cities;
  if (cities.length === 0) return '';
  if (cities.length === 1) return cities[0].city;
  
  const cityNames = cities.map(c => c.city);
  return cityNames.slice(0, -1).join(', ') + ' and ' + cityNames[cityNames.length - 1];
};

export default serviceabilitySlice.reducer;




