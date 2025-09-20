import { createSlice } from '@reduxjs/toolkit';

// Helper function to get cart item ID (use service_id if available, otherwise generate)
const getCartItemId = (serviceData) => {
  // If service has a unique service_id, use it
  if (serviceData.service_id) {
    return serviceData.service_id;
  }
  // Fallback to generated ID for backward compatibility
  return `${serviceData.cardHeader}_${serviceData.price}_${serviceData.category || 'default'}`;
};

// Helper function to calculate item subtotal
const calculateItemSubtotal = (price, quantity) => {
  const itemPrice = parseFloat(price) || 0;
  return itemPrice * quantity;
};

// Helper function to get cart total (grand total)
const getCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + calculateItemSubtotal(item.price, item.quantity);
  }, 0);
};

// Helper function to get total items count (sum of all quantities)
const getTotalItemsCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Helper function to get total services count (unique services)
const getTotalServicesCount = (items) => {
  return items.length;
};

// Helper function to calculate tax amount (assuming 18% GST)
const calculateTaxAmount = (subtotal) => {
  return subtotal * 0.18; // 18% GST
};

// Helper function to calculate final total with tax
const calculateFinalTotal = (subtotal, taxAmount) => {
  return subtotal + taxAmount;
};

// Helper function to update cart summary
const updateCartSummary = (items) => {
  const subtotal = getCartTotal(items);
  const taxAmount = calculateTaxAmount(subtotal);
  const total = calculateFinalTotal(subtotal, taxAmount);
  
  return {
    totalServices: getTotalServicesCount(items),
    totalItems: getTotalItemsCount(items),
    subtotal: subtotal,
    taxAmount: taxAmount,
    total: total,
  };
};

const initialState = {
  items: [], // Array of cart items with detailed information
  summary: {
    totalServices: 0, // Number of unique services
    totalItems: 0, // Total quantity of all items
    subtotal: 0, // Subtotal before tax
    taxAmount: 0, // Tax amount (18% GST)
    total: 0, // Final total including tax
  },
  isCartOpen: false, // For cart modal/drawer state
  lastUpdated: null, // Timestamp of last cart update
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const serviceData = action.payload;
      
      // Get cart item ID (use service_id if available)
      const cartItemId = getCartItemId(serviceData);
      
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.id === cartItemId);
      
      if (existingItem) {
        // If item exists, increment quantity
        existingItem.quantity += 1;
        // Item quantity increased successfully
      } else {
        // If item doesn't exist, add new item with detailed information
        const newCartItem = {
          id: cartItemId,
          service_id: serviceData.service_id, // Store the original service_id
          cardHeader: serviceData.cardHeader,
          description: serviceData.description,
          price: parseFloat(serviceData.price) || 0,
          img: serviceData.img,
          quantity: 1,
          duration: serviceData.duration,
          taxIncluded: serviceData.taxIncluded,
          category: serviceData.category || 'default',
          serviceType: serviceData.serviceType || 'Standard',
          addedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          subtotal: calculateItemSubtotal(serviceData.price, 1),
        };
        
        state.items.push(newCartItem);
        // Item added successfully
      }
      
      // Update item subtotal if quantity changed
      if (existingItem) {
        existingItem.subtotal = calculateItemSubtotal(existingItem.price, existingItem.quantity);
        existingItem.lastModified = new Date().toISOString();
      }
      
      // Update cart summary
      state.summary = updateCartSummary(state.items);
      state.lastUpdated = new Date().toISOString();
      
      // Log complete cart state
      console.log('Full Cart State:', {
        summary: state.summary,
        itemsCount: state.items.length,
        items: state.items.map(item => ({
          name: item.cardHeader,
          service_id: item.service_id,
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          category: item.category
        }))
      });
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      
      const itemToRemove = state.items.find(item => item.id === itemId);
      if (itemToRemove) {
        console.log('🛒 Cart State - Item removed:', {
          item: itemToRemove.cardHeader,
          quantity: itemToRemove.quantity
        });
      }
      
      state.items = state.items.filter(item => item.id !== itemId);
      state.summary = updateCartSummary(state.items);
      state.lastUpdated = new Date().toISOString();
      
      // Log complete cart state after removal
      console.log('Full Cart State:', {
        summary: state.summary,
        itemsCount: state.items.length,
        items: state.items.map(item => ({
          name: item.cardHeader,
          service_id: item.service_id,
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          category: item.category
        }))
      });
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = Math.max(0, quantity); // Ensure quantity is not negative
        
        console.log('🛒 Cart State - Quantity updated:', {
          item: item.cardHeader,
          oldQuantity,
          newQuantity: item.quantity
        });
        
        // If quantity becomes 0, remove item from cart
        if (item.quantity === 0) {
          state.items = state.items.filter(cartItem => cartItem.id !== itemId);
          console.log('🛒 Cart State - Item removed (quantity = 0):', item.cardHeader);
        } else {
          // Update item subtotal and last modified
          item.subtotal = calculateItemSubtotal(item.price, item.quantity);
          item.lastModified = new Date().toISOString();
        }
        
        // Update cart summary
        state.summary = updateCartSummary(state.items);
        state.lastUpdated = new Date().toISOString();
        
        // Log complete cart state after quantity update
        console.log('Full Cart State:', {
          summary: state.summary,
          itemsCount: state.items.length,
          items: state.items.map(item => ({
            name: item.cardHeader,
            service_id: item.service_id,
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            category: item.category
          }))
        });
      }
    },

    // Increase item quantity by 1
    increaseQuantity: (state, action) => {
      const itemId = action.payload;
      
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.quantity += 1;
        item.subtotal = calculateItemSubtotal(item.price, item.quantity);
        item.lastModified = new Date().toISOString();
        
        state.summary = updateCartSummary(state.items);
        state.lastUpdated = new Date().toISOString();
        
        // Log complete cart state after increment
        console.log('Full Cart State:', {
          summary: state.summary,
          itemsCount: state.items.length,
          items: state.items.map(item => ({
            name: item.cardHeader,
            service_id: item.service_id,
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            category: item.category
          }))
        });
      }
    },

    // Decrease item quantity by 1
    decreaseQuantity: (state, action) => {
      const itemId = action.payload;
      
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.quantity = Math.max(0, item.quantity - 1);
        
        console.log('🛒 Cart State - Quantity decreased:', {
          item: item.cardHeader,
          newQuantity: item.quantity
        });
        
        // If quantity becomes 0, remove item from cart
        if (item.quantity === 0) {
          state.items = state.items.filter(cartItem => cartItem.id !== itemId);
          console.log('🛒 Cart State - Item removed (quantity = 0):', item.cardHeader);
        } else {
          // Update item subtotal and last modified
          item.subtotal = calculateItemSubtotal(item.price, item.quantity);
          item.lastModified = new Date().toISOString();
        }
        
        state.summary = updateCartSummary(state.items);
        state.lastUpdated = new Date().toISOString();
        
        // Log complete cart state after decrement
        console.log('Full Cart State:', {
          summary: state.summary,
          itemsCount: state.items.length,
          items: state.items.map(item => ({
            name: item.cardHeader,
            service_id: item.service_id,
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            category: item.category
          }))
        });
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      const itemCount = state.items.length;
      const clearedSummary = state.summary;
      
      console.log('🛒 Cart State - Cart cleared:', {
        itemsRemoved: itemCount,
        clearedSummary: clearedSummary
      });
      
      state.items = [];
      state.summary = {
        totalServices: 0,
        totalItems: 0,
        subtotal: 0,
        taxAmount: 0,
        total: 0,
      };
      state.lastUpdated = new Date().toISOString();
    },

    // Toggle cart modal/drawer
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
      console.log('🛒 Cart State - Cart toggled:', {
        isOpen: state.isCartOpen,
        itemsCount: state.items.length
      });
    },

    // Set cart modal/drawer state
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
      console.log('🛒 Cart State - Cart state set:', {
        isOpen: state.isCartOpen,
        itemsCount: state.items.length
      });
    },

    // Get item quantity for a specific service
    getItemQuantity: (state, action) => {
      const serviceData = action.payload;
      const cartItemId = generateCartItemId(serviceData);
      const item = state.items.find(item => item.id === cartItemId);
      
      console.log('🛒 Cart State - Item quantity requested:', {
        service: serviceData.cardHeader,
        quantity: item ? item.quantity : 0
      });
      
      return item ? item.quantity : 0;
    }
  },
  extraReducers: (builder) => {
    // Handle getCart.fulfilled - restore cart from database
    builder.addCase('cart/getCart/fulfilled', (state, action) => {
      const cartData = action.payload.data.cart;
      
      if (cartData && cartData.items && cartData.items.length > 0) {
        console.log('🛒 Cart Slice - Restoring cart from database:', {
          itemsCount: cartData.items.length,
          totalItems: cartData.summary.totalItems,
          totalServices: cartData.summary.totalServices,
          subtotal: cartData.summary.subtotal,
          total: cartData.summary.total
        });
        
        // Transform database items back to frontend format
        state.items = cartData.items.map(item => ({
          id: item.serviceId, // Use serviceId as id for consistency
          service_id: item.serviceId, // Store service_id
          cardHeader: item.cardHeader,
          description: item.description,
          price: item.price,
          img: item.img,
          quantity: item.quantity,
          duration: item.duration,
          taxIncluded: item.taxIncluded,
          category: item.category,
          serviceType: item.serviceType,
          subtotal: item.subtotal,
          addedAt: item.addedAt,
          lastModified: item.lastModified
        }));
        
        // Update summary
        state.summary = {
          totalServices: cartData.summary.totalServices,
          totalItems: cartData.summary.totalItems,
          subtotal: cartData.summary.subtotal,
          taxAmount: cartData.summary.taxAmount,
          total: cartData.summary.total
        };
        
        state.lastUpdated = new Date().toISOString();
        
        console.log('✅ Cart Slice - Cart restored from database successfully');
        console.log('Full Cart State (After Database Restore):', {
          summary: state.summary,
          itemsCount: state.items.length,
          items: state.items.map(item => ({
            name: item.cardHeader,
            service_id: item.service_id,
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            category: item.category
          }))
        });
      } else {
        console.log('🛒 Cart Slice - No cart data found in database, keeping current cart');
      }
    });
    
    // Handle getCart.rejected - log error but don't modify state
    builder.addCase('cart/getCart/rejected', (state, action) => {
      console.error('❌ Cart Slice - Failed to restore cart from database:', action.payload);
    });
  }
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  getItemQuantity
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartSummary = (state) => state.cart.summary;
export const selectCartTotal = (state) => state.cart.summary.total;
export const selectCartSubtotal = (state) => state.cart.summary.subtotal;
export const selectCartTaxAmount = (state) => state.cart.summary.taxAmount;
export const selectCartItemsCount = (state) => state.cart.summary.totalItems;
export const selectCartServicesCount = (state) => state.cart.summary.totalServices;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectCartLastUpdated = (state) => state.cart.lastUpdated;

// Selector to get quantity for a specific service
export const selectItemQuantity = (serviceData) => (state) => {
  const cartItemId = getCartItemId(serviceData);
  const item = state.cart.items.find(item => item.id === cartItemId);
  return item ? item.quantity : 0;
};

// Selector to check if item is in cart
export const selectIsItemInCart = (serviceData) => (state) => {
  const cartItemId = getCartItemId(serviceData);
  return state.cart.items.some(item => item.id === cartItemId);
};

export default cartSlice.reducer;
