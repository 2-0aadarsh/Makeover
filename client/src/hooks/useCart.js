import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  selectCartItems,
  selectCartSummary,
  selectCartTotal,
  selectCartSubtotal,
  selectCartTaxAmount,
  selectCartItemsCount,
  selectCartServicesCount,
  selectIsCartOpen,
  selectCartLastUpdated,
  selectItemQuantity,
  selectIsItemInCart
} from '../features/cart/cartSlice';
import {
  addItemToDBCart,
  clearCartFromDB,
  getCart,
  removeItemFromDBCart,
  updateItemQuantityInDB,
} from '../features/cart/cartThunks';
import { transformCartItem, normalizeServiceId } from '../features/cart/cartApi';

export const useCart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // Selectors
  const items = useSelector(selectCartItems);
  const summary = useSelector(selectCartSummary);
  const total = useSelector(selectCartTotal);
  const subtotal = useSelector(selectCartSubtotal);
  const taxAmount = useSelector(selectCartTaxAmount);
  const totalItems = useSelector(selectCartItemsCount);
  const totalServices = useSelector(selectCartServicesCount);
  const isCartOpen = useSelector(selectIsCartOpen);
  const lastUpdated = useSelector(selectCartLastUpdated);


  // Actions
  const addItemToCart = async (serviceData) => {
    dispatch(addToCart(serviceData));

    if (!isAuthenticated) {
      return;
    }

    try {
      const payload = transformCartItem(serviceData, 1);
      await dispatch(addItemToDBCart(payload)).unwrap();
    } catch (error) {
      console.error("❌ Failed to sync added item to backend:", error);
      dispatch(removeFromCart(normalizeServiceId(serviceData)));
      dispatch(getCart());
    }
  };

  const removeItemFromCart = async (itemId) => {
    const serviceId = normalizeServiceId({ serviceId: itemId });
    dispatch(removeFromCart(serviceId));

    if (!isAuthenticated) {
      return;
    }

    try {
      await dispatch(removeItemFromDBCart(serviceId)).unwrap();
    } catch (error) {
      console.error("❌ Failed to remove item from backend cart:", error);
      dispatch(getCart());
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    const serviceId = normalizeServiceId({ serviceId: itemId });

    const clampedQuantity = Math.max(0, quantity);
    dispatch(updateQuantity({ itemId: serviceId, quantity: clampedQuantity }));

    if (!isAuthenticated) {
      return;
    }

    try {
      if (clampedQuantity === 0) {
        await dispatch(removeItemFromDBCart(serviceId)).unwrap();
      } else {
        await dispatch(updateItemQuantityInDB({ serviceId, quantity: clampedQuantity })).unwrap();
      }
    } catch (error) {
      console.error("❌ Failed to update item quantity in backend cart:", error);
      dispatch(getCart());
    }
  };

  const incrementQuantity = async (itemId) => {
    const serviceId = normalizeServiceId({ serviceId: itemId });
    const currentItem = items.find((item) => normalizeServiceId(item) === serviceId);
    const nextQuantity = (currentItem?.quantity ?? 0) + 1;

    dispatch(increaseQuantity(serviceId));

    if (!isAuthenticated) {
      return;
    }

    try {
      await dispatch(updateItemQuantityInDB({ serviceId, quantity: nextQuantity })).unwrap();
    } catch (error) {
      console.error("❌ Failed to increment item quantity in backend cart:", error);
      dispatch(decreaseQuantity(serviceId));
      dispatch(getCart());
    }
  };

  const decrementQuantity = async (itemId) => {
    const serviceId = normalizeServiceId({ serviceId: itemId });
    const currentItem = items.find((item) => normalizeServiceId(item) === serviceId);
    const nextQuantity = Math.max(0, (currentItem?.quantity ?? 0) - 1);

    dispatch(decreaseQuantity(serviceId));

    if (!isAuthenticated) {
      return;
    }

    try {
      if (nextQuantity === 0) {
        await dispatch(removeItemFromDBCart(serviceId)).unwrap();
      } else {
        await dispatch(updateItemQuantityInDB({ serviceId, quantity: nextQuantity })).unwrap();
      }
    } catch (error) {
      console.error("❌ Failed to decrement item quantity in backend cart:", error);
      // Revert optimistic update
      dispatch(increaseQuantity(serviceId));
      dispatch(getCart());
    }
  };

  const clearAllCart = async () => {
    dispatch(clearCart());

    if (!isAuthenticated) {
      return;
    }

    try {
      await dispatch(clearCartFromDB()).unwrap();
    } catch (error) {
      console.error("❌ Failed to clear backend cart:", error);
      dispatch(getCart());
    }
  };

  const toggleCartModal = () => {
    dispatch(toggleCart());
  };

  const setCartModalOpen = (isOpen) => {
    dispatch(setCartOpen(isOpen));
  };

  // Helper functions
  const getItemQuantity = (serviceData) => {
    return useSelector(selectItemQuantity(serviceData));
  };

  const isItemInCart = (serviceData) => {
    return useSelector(selectIsItemInCart(serviceData));
  };

  const getCartItemById = (itemId) => {
    return items.find(item => item.id === itemId);
  };

  const getCartSummary = () => {
    return {
      summary,
      totalItems,
      totalServices,
      totalPrice: total,
      subtotal,
      taxAmount,
      itemsCount: items.length,
      isEmpty: items.length === 0,
      lastUpdated
    };
  };

  return {
    // State
    items,
    summary,
    total,
    subtotal,
    taxAmount,
    totalItems,
    totalServices,
    isCartOpen,
    lastUpdated,
    
    // Actions
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    clearAllCart,
    toggleCartModal,
    setCartModalOpen,
    
    // Helper functions
    getItemQuantity,
    isItemInCart,
    getCartItemById,
    getCartSummary
  };
};
