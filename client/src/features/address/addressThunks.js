import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserAddresses as getUserAddressesApi,
  createAddress as createAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
  setDefaultAddress as setDefaultAddressApi,
  getDefaultAddress as getDefaultAddressApi,
  getAddressStats as getAddressStatsApi,
  restoreAddress as restoreAddressApi,
  permanentlyDeleteAddress as permanentlyDeleteAddressApi,
  checkAddressStatus as checkAddressStatusApi
} from './addressApi';

// Get all addresses for the authenticated user
export const getUserAddresses = createAsyncThunk(
  'address/getUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching user addresses...');
      const response = await getUserAddressesApi();
      console.log('Addresses fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return rejectWithValue(error.message || 'Failed to fetch addresses');
    }
  }
);

// Create a new address
export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      console.log('Creating address with data:', addressData);
      
      // Validate required fields (matching server requirements)
      const requiredFields = ['address', 'city', 'state', 'pincode'];
      const missingFields = requiredFields.filter(field => !addressData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate pincode format (matching server regex)
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeRegex.test(addressData.pincode)) {
        throw new Error('Please provide a valid 6-digit pincode');
      }

      // Map client form fields to server API fields
      const serverAddressData = {
        houseFlatNumber: addressData.houseFlatNumber || 'N/A', // Default if not provided
        streetAreaName: addressData.streetAreaName || addressData.address, // Use address if streetAreaName not provided
        completeAddress: addressData.address, // Map 'address' to 'completeAddress'
        landmark: addressData.landmark || '',
        pincode: addressData.pincode,
        city: addressData.city || '',
        state: addressData.state || 'Bihar',
        country: addressData.country || 'India',
        addressType: addressData.addressType || 'home',
        isDefault: addressData.isDefault || false
      };

      console.log('Mapped address data for server:', serverAddressData);

      const response = await createAddressApi(serverAddressData);
      console.log('Address created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating address:', error);
      return rejectWithValue(error.message || 'Failed to create address');
    }
  }
);

// Update an existing address
export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('Updating address:', id, data);
      
      // Validate required fields (matching server requirements)
      const requiredFields = ['address', 'city', 'state', 'pincode'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate pincode format (matching server regex)
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeRegex.test(data.pincode)) {
        throw new Error('Please provide a valid 6-digit pincode');
      }

      // Map client form fields to server API fields
      const serverAddressData = {
        houseFlatNumber: data.houseFlatNumber || 'N/A',
        streetAreaName: data.streetAreaName || data.address,
        completeAddress: data.address,
        landmark: data.landmark || '',
        pincode: data.pincode,
        city: data.city || '',
        state: data.state || 'Bihar',
        country: data.country || 'India',
        addressType: data.addressType || 'home',
        isDefault: data.isDefault || false
      };

      console.log('Mapped update data for server:', serverAddressData);

      const response = await updateAddressApi(id, serverAddressData);
      console.log('Address updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      return rejectWithValue(error.message || 'Failed to update address');
    }
  }
);

// Delete an address (soft delete)
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      console.log('Deleting address:', addressId);
      const response = await deleteAddressApi(addressId);
      console.log('Address deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error deleting address:', error);
      return rejectWithValue(error.message || 'Failed to delete address');
    }
  }
);

// Set an address as default
export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      console.log('Setting default address:', addressId);
      const response = await setDefaultAddressApi(addressId);
      console.log('Default address set successfully:', response);
      return response;
    } catch (error) {
      console.error('Error setting default address:', error);
      return rejectWithValue(error.message || 'Failed to set default address');
    }
  }
);

// Get default address
export const getDefaultAddress = createAsyncThunk(
  'address/getDefaultAddress',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching default address...');
      const response = await getDefaultAddressApi();
      console.log('Default address fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching default address:', error);
      return rejectWithValue(error.message || 'Failed to fetch default address');
    }
  }
);

// Get address statistics
export const getAddressStats = createAsyncThunk(
  'address/getAddressStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching address statistics...');
      const response = await getAddressStatsApi();
      console.log('Address stats fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching address stats:', error);
      return rejectWithValue(error.message || 'Failed to fetch address statistics');
    }
  }
);

// Restore a soft-deleted address
export const restoreAddress = createAsyncThunk(
  'address/restoreAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      console.log('Restoring address:', addressId);
      const response = await restoreAddressApi(addressId);
      console.log('Address restored successfully:', response);
      return response;
    } catch (error) {
      console.error('Error restoring address:', error);
      return rejectWithValue(error.message || 'Failed to restore address');
    }
  }
);

// Permanently delete an address
export const permanentlyDeleteAddress = createAsyncThunk(
  'address/permanentlyDeleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      console.log('Permanently deleting address:', addressId);
      const response = await permanentlyDeleteAddressApi(addressId);
      console.log('Address permanently deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error permanently deleting address:', error);
      return rejectWithValue(error.message || 'Failed to permanently delete address');
    }
  }
);

// Check address status (debug endpoint)
export const checkAddressStatus = createAsyncThunk(
  'address/checkAddressStatus',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Checking address status...');
      const response = await checkAddressStatusApi();
      console.log('Address status checked successfully:', response);
      return response;
    } catch (error) {
      console.error('Error checking address status:', error);
      return rejectWithValue(error.message || 'Failed to check address status');
    }
  }
);





