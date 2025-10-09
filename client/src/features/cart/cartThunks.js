import { createAsyncThunk } from '@reduxjs/toolkit';
import { debounce } from 'lodash';
import { 
  saveCartToDatabase, 
  getCartFromDatabase, 
  restoreCartFromDatabase, 
  clearCartFromDatabase,
  addItemToDatabaseCart,
  updateItemQuantityInDatabase,
  removeItemFromDatabaseCart
} from './cartApi';

// Save cart data to database
export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (cartData, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Saving cart to database:', {
        itemsCount: cartData.items.length,
        totalItems: cartData.summary.totalItems,
        totalServices: cartData.summary.totalServices,
        subtotal: cartData.summary.subtotal,
        total: cartData.summary.total
      });

      const response = await saveCartToDatabase(cartData);
      
      console.log('✅ Cart Thunk - Cart saved to database successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to save cart to database:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Get cart data from database
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Getting cart from database');
      
      const response = await getCartFromDatabase();
      
      console.log('✅ Cart Thunk - Cart retrieved from database:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to get cart from database:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Restore cart data from database (merge with localStorage)
export const restoreCart = createAsyncThunk(
  'cart/restoreCart',
  async (localStorageCartData, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Restoring cart from database:', {
        localStorageItemsCount: localStorageCartData.items.length
      });
      
      const response = await restoreCartFromDatabase(localStorageCartData);
      
      console.log('✅ Cart Thunk - Cart restored from database:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to restore cart from database:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Clear cart from database
export const clearCartFromDB = createAsyncThunk(
  'cart/clearCartFromDB',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Clearing cart from database');
      
      const response = await clearCartFromDatabase();
      
      console.log('✅ Cart Thunk - Cart cleared from database:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to clear cart from database:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add single item to database cart
export const addItemToDBCart = createAsyncThunk(
  'cart/addItemToDBCart',
  async (itemData, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Adding item to database cart:', {
        serviceName: itemData.cardHeader,
        serviceId: itemData.service_id,
        price: itemData.price,
        quantity: itemData.quantity || 1
      });
      
      const response = await addItemToDatabaseCart(itemData);
      
      console.log('✅ Cart Thunk - Item added to database cart:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to add item to database cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update item quantity in database cart
export const updateItemQuantityInDB = createAsyncThunk(
  'cart/updateItemQuantityInDB',
  async ({ serviceId, quantity }, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Updating item quantity in database cart:', {
        serviceId,
        quantity
      });
      
      const response = await updateItemQuantityInDatabase(serviceId, quantity);
      
      console.log('✅ Cart Thunk - Item quantity updated in database cart:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to update item quantity in database cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Remove item from database cart
export const removeItemFromDBCart = createAsyncThunk(
  'cart/removeItemFromDBCart',
  async (serviceId, { rejectWithValue }) => {
    try {
      console.log('🛒 Cart Thunk - Removing item from database cart:', { serviceId });
      
      const response = await removeItemFromDatabaseCart(serviceId);
      
      console.log('✅ Cart Thunk - Item removed from database cart:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to remove item from database cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Auto-save cart data to database (debounced)
export const autoSaveCart = createAsyncThunk(
  'cart/autoSaveCart',
  async (cartData, { rejectWithValue }) => {
    try {
      console.log('🔄 Cart Thunk - Auto-saving cart to database:', {
        itemsCount: cartData.items.length,
        totalItems: cartData.summary.totalItems,
        totalServices: cartData.summary.totalServices,
        subtotal: cartData.summary.subtotal,
        total: cartData.summary.total
      });

      const response = await saveCartToDatabase(cartData);
      
      console.log('✅ Cart Thunk - Cart auto-saved to database successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Cart Thunk - Failed to auto-save cart to database:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Create debounced auto-save function
export const createDebouncedAutoSave = (dispatch) => {
  return debounce((cartData) => {
    dispatch(autoSaveCart(cartData));
  }, 2000); // 2-second delay
};
