import { backendurl } from "../../constants";

// Save cart data to database
export const saveCartToDatabase = async (cartData) => {
  try {
    // Transform items for backend
    const transformedItems = cartData.items.map(item => ({
      serviceId: item.service_id, // Transform service_id to serviceId for backend
      cardHeader: item.cardHeader,
      description: item.description,
      price: item.price,
      img: item.img,
      quantity: item.quantity,
      duration: item.duration,
      taxIncluded: item.taxIncluded,
      category: item.category,
      serviceType: item.serviceType,
      subtotal: item.subtotal
    }));

    console.log('🛒 Cart API - Attempting to save cart to database:', {
      backendurl,
      itemsCount: cartData.items.length,
      originalItems: cartData.items.map(item => ({
        name: item.cardHeader,
        service_id: item.service_id,
        quantity: item.quantity,
        price: item.price
      })),
      transformedItems: transformedItems.map(item => ({
        name: item.cardHeader,
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: item.price
      }))
    });

    const response = await fetch(`${backendurl}/api/cart/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: JWT token will be sent via cookies (credentials: 'include')
      },
      credentials: 'include', // Important for sending JWT token via cookies
      body: JSON.stringify({
        items: transformedItems
      })
    });

    console.log('🛒 Cart API - Response status:', response.status);
    console.log('🛒 Cart API - Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🛒 Cart API - Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('🛒 Cart API - Response data:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to save cart to database');
    }

    console.log('✅ Cart API - Cart saved to database successfully');
    return data;
  } catch (error) {
    console.error('❌ Cart API - Error saving cart to database:', error);
    throw error;
  }
};

// Get cart data from database
export const getCartFromDatabase = async () => {
  try {
    const response = await fetch(`${backendurl}/api/cart`, {
      method: 'GET',
      credentials: 'include', // Important for sending JWT token via cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get cart from database');
    }

    return data;
  } catch (error) {
    console.error('Error getting cart from database:', error);
    throw error;
  }
};

// Restore cart data from database (merge with localStorage)
export const restoreCartFromDatabase = async (localStorageCartData) => {
  try {
    const response = await fetch(`${backendurl}/api/cart/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        items: localStorageCartData.items || []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to restore cart from database');
    }

    return data;
  } catch (error) {
    console.error('Error restoring cart from database:', error);
    throw error;
  }
};

// Clear cart from database
export const clearCartFromDatabase = async () => {
  try {
    const response = await fetch(`${backendurl}/api/cart/clear`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to clear cart from database');
    }

    return data;
  } catch (error) {
    console.error('Error clearing cart from database:', error);
    throw error;
  }
};

// Add single item to cart in database
export const addItemToDatabaseCart = async (itemData) => {
  try {
    const response = await fetch(`${backendurl}/api/cart/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to add item to database cart');
    }

    return data;
  } catch (error) {
    console.error('Error adding item to database cart:', error);
    throw error;
  }
};

// Update item quantity in database cart
export const updateItemQuantityInDatabase = async (serviceId, quantity) => {
  try {
    const response = await fetch(`${backendurl}/api/cart/item/${serviceId}/quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update item quantity in database cart');
    }

    return data;
  } catch (error) {
    console.error('Error updating item quantity in database cart:', error);
    throw error;
  }
};

// Remove item from database cart
export const removeItemFromDatabaseCart = async (serviceId) => {
  try {
    const response = await fetch(`${backendurl}/api/cart/item/${serviceId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to remove item from database cart');
    }

    return data;
  } catch (error) {
    console.error('Error removing item from database cart:', error);
    throw error;
  }
};
