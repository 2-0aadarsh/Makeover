import { backendurl } from "../../constants";

/**
 * Normalize the serviceId property for backend consumption.
 * Falls back to `service_id`, `id`, or a generated composite key.
 */
const normalizeServiceId = (item) => {
  if (!item) return "";

  if (typeof item.serviceId === "string" && item.serviceId.trim().length > 0) {
    return item.serviceId.trim();
  }

  if (typeof item.service_id === "string" && item.service_id.trim().length > 0) {
    return item.service_id.trim();
  }

  if (typeof item.id === "string" && item.id.trim().length > 0) {
    return item.id.trim();
  }

  if (item.cardHeader) {
    return `${item.cardHeader}_${item.price ?? 0}_${item.category ?? "default"}`;
  }

  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Convert a frontend cart item into the shape expected by the backend.
 * Accepts both Redux cart items and raw service data objects.
 */
const transformCartItem = (item, overrideQuantity) => {
  const price = parseFloat(item?.price ?? 0);
  const quantity = overrideQuantity ?? item?.quantity ?? 1;

  return {
    serviceId: normalizeServiceId(item),
    cardHeader: item?.cardHeader ?? item?.name ?? "",
    description: item?.description ?? "",
    price,
    img: item?.img ?? item?.image ?? "",
    quantity,
    duration: item?.duration ?? "",
    taxIncluded: Boolean(item?.taxIncluded),
    category: item?.category ?? "default",
    serviceType: item?.serviceType ?? "Standard",
    subtotal: price * quantity,
  };
};

/**
 * Transform a full cart state into the payload required by the backend.
 */
const transformCartPayload = (cartData) => {
  const items = Array.isArray(cartData?.items) ? cartData.items : [];
  return items.map((item) => transformCartItem(item));
};

// Save cart data to database
export const saveCartToDatabase = async (cartData) => {
  try {
    const transformedItems = transformCartPayload(cartData);

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
        items: transformedItems,
      }),
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
    const payload = transformCartItem(itemData);

    const response = await fetch(`${backendurl}/api/cart/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload)
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
    const normalizedId = normalizeServiceId({ serviceId });
    const response = await fetch(`${backendurl}/api/cart/item/${normalizedId}/quantity`, {
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
    const normalizedId = normalizeServiceId({ serviceId });
    const response = await fetch(`${backendurl}/api/cart/item/${normalizedId}`, {
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

export {
  normalizeServiceId,
  transformCartItem,
  transformCartPayload,
};
