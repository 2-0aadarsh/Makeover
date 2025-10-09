import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { autoSaveCart } from '../features/cart/cartThunks';

// Custom hook for auto-saving cart data
export const useCartAutoSave = () => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.cart);
  const authState = useSelector(state => state.auth);
  const debouncedAutoSave = useRef(null);

  console.log('🔄 Auto-Save Hook - Hook initialized:', {
    itemsCount: cartState.items.length,
    isAuthenticated: authState.isAuthenticated,
    lastUpdated: cartState.lastUpdated
  });

  // Create debounced auto-save function
  useEffect(() => {
    debouncedAutoSave.current = debounce((cartData) => {
      console.log('🔄 Auto-Save Hook - Debounced function triggered:', {
        itemsCount: cartData.items.length,
        totalItems: cartData.summary.totalItems,
        lastUpdated: cartData.lastUpdated,
        timestamp: new Date().toISOString()
      });
      
      dispatch(autoSaveCart(cartData));
    }, 2000); // 2-second delay

    return () => {
      // Cancel any pending debounced calls on unmount
      if (debouncedAutoSave.current) {
        debouncedAutoSave.current.cancel();
      }
    };
  }, [dispatch]);

  // Auto-save when cart state changes
  useEffect(() => {
    console.log('🔄 Auto-Save Hook - useEffect triggered:', {
      itemsCount: cartState.items.length,
      isAuthenticated: authState.isAuthenticated,
      lastUpdated: cartState.lastUpdated,
      hasItems: cartState.items.length > 0,
      authUser: authState.user?.name,
      authStatus: authState.status
    });

    // Only auto-save if cart has items, user is authenticated, and auth status is succeeded
    if (cartState.items.length > 0 && authState.isAuthenticated && authState.status === 'succeeded') {
      console.log('✅ Auto-Save Hook - Conditions met, scheduling auto-save:', {
        itemsCount: cartState.items.length,
        lastUpdated: cartState.lastUpdated,
        isAuthenticated: authState.isAuthenticated,
        authStatus: authState.status,
        summary: cartState.summary
      });
      
      if (debouncedAutoSave.current) {
        debouncedAutoSave.current(cartState);
      }
    } else {
      console.log('❌ Auto-Save Hook - Conditions not met:', {
        hasItems: cartState.items.length > 0,
        isAuthenticated: authState.isAuthenticated,
        authStatus: authState.status,
        itemsCount: cartState.items.length,
        authUser: authState.user?.name
      });
    }
  }, [cartState.items, cartState.summary, cartState.lastUpdated, authState.isAuthenticated, authState.status]);

  // Force save function for critical operations (checkout, payment, etc.)
  const forceSaveCart = async () => {
    if (cartState.items.length > 0 && authState.isAuthenticated) {
      console.log('🔄 Auto-Save Hook - Force saving cart for critical operation');
      
      // Cancel any pending debounced calls
      if (debouncedAutoSave.current) {
        debouncedAutoSave.current.cancel();
      }
      
      // Immediately save to database
      await dispatch(autoSaveCart(cartState));
    }
  };

  // Manual trigger for testing
  const triggerAutoSave = () => {
    console.log('🔄 Auto-Save Hook - Manual trigger called');
    if (debouncedAutoSave.current) {
      debouncedAutoSave.current(cartState);
    }
  };

  // Return the debounced function and force save function
  return {
    debouncedAutoSave: debouncedAutoSave.current,
    forceSaveCart,
    triggerAutoSave
  };
};
