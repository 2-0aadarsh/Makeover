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

export const useCart = () => {
  const dispatch = useDispatch();
  
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
  const addItemToCart = (serviceData) => {
    dispatch(addToCart(serviceData));
  };

  const removeItemFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const updateItemQuantity = (itemId, quantity) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  const incrementQuantity = (itemId) => {
    dispatch(increaseQuantity(itemId));
  };

  const decrementQuantity = (itemId) => {
    dispatch(decreaseQuantity(itemId));
  };

  const clearAllCart = () => {
    dispatch(clearCart());
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
