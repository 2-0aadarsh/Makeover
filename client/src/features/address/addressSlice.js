import { createSlice } from '@reduxjs/toolkit';
<<<<<<< HEAD
import { logoutUser } from '../auth/authThunks';
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from './addressThunks';

const initialState = {
  addresses: [],
  defaultAddress: null,
  isLoading: false,
  error: null,
  lastUpdated: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
    clearAddressData: (state) => {
      state.addresses = [];
      state.defaultAddress = null;
      state.lastUpdated = null;
    },
    setDefaultAddress: (state, action) => {
      state.addresses.forEach(address => {
        address.isDefault = false;
      });
      const addressIndex = state.addresses.findIndex(
        address => address._id === action.payload
      );
      if (addressIndex !== -1) {
        state.addresses[addressIndex].isDefault = true;
        state.defaultAddress = state.addresses[addressIndex];
      }
    },
    updateAddressInList: (state, action) => {
      const updatedAddress = action.payload;
      const index = state.addresses.findIndex(
        address => address._id === updatedAddress._id
      );
      if (index !== -1) {
        state.addresses[index] = updatedAddress;
        if (updatedAddress.isDefault) {
          state.defaultAddress = updatedAddress;
        }
      }
    },
    removeAddressFromList: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter(
        address => address._id !== addressId
      );
      if (state.defaultAddress && state.defaultAddress._id === addressId) {
        state.defaultAddress = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
<<<<<<< HEAD
      // Clear address state on logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.addresses = [];
        state.defaultAddress = null;
        state.isLoading = false;
        state.error = null;
        state.lastUpdated = null;
      })
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
      // Get User Addresses
      .addCase(getUserAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data?.addresses || [];
        state.defaultAddress = action.payload.data?.addresses?.find(addr => addr.isDefault) || null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const newAddress = action.payload.data?.address; // Server returns { data: { address: ... } }
        if (newAddress) {
          state.addresses.push(newAddress);
          if (newAddress.isDefault) {
            state.addresses.forEach(address => {
              if (address._id !== newAddress._id) {
                address.isDefault = false;
              }
            });
            state.defaultAddress = newAddress;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedAddress = action.payload.data?.address; // Server returns { data: { address: ... } }
        if (updatedAddress) {
          const index = state.addresses.findIndex(
            address => address._id === updatedAddress._id
          );
          if (index !== -1) {
            state.addresses[index] = updatedAddress;
            if (updatedAddress.isDefault) {
              state.addresses.forEach(address => {
                if (address._id !== updatedAddress._id) {
                  address.isDefault = false;
                }
              });
              state.defaultAddress = updatedAddress;
            } else if (state.defaultAddress && state.defaultAddress._id === updatedAddress._id) {
              state.defaultAddress = null;
            }
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const addressId = action.payload.data._id;
        state.addresses = state.addresses.filter(
          address => address._id !== addressId
        );
        if (state.defaultAddress && state.defaultAddress._id === addressId) {
          state.defaultAddress = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Set Default Address
      .addCase(setDefaultAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const addressId = action.payload.data._id;
        state.addresses.forEach(address => {
          address.isDefault = false;
        });
        const addressIndex = state.addresses.findIndex(
          address => address._id === addressId
        );
        if (addressIndex !== -1) {
          state.addresses[addressIndex].isDefault = true;
          state.defaultAddress = state.addresses[addressIndex];
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const {
  clearAddressError,
  clearAddressData,
  setDefaultAddress: setDefaultAddressAction,
  updateAddressInList,
  removeAddressFromList
} = addressSlice.actions;

export default addressSlice.reducer;