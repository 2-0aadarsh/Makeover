import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkLoginStatusApi, forgetPassword, loginApi, logoutApi, resendOtpApi, resetPasswordApi, signupApi, verifyOtpApi } from "./authApi";
import { saveCart, getCart } from "../cart/cartThunks";

export const loginUser = createAsyncThunk(
  "auth/login", 
  
  async(credentials, { rejectWithValue, dispatch })=>{
    try {
      const result = await loginApi(credentials);
      
      // After successful login, restore cart data from database
      if (result.success) {
        try {
          console.log('🛒 Login - Restoring cart data from database after successful login');
          await dispatch(getCart()).unwrap();
          console.log('✅ Login - Cart data restored from database successfully');
        } catch (cartError) {
          console.error('❌ Login - Failed to restore cart from database:', cartError);
          // Continue with login even if cart restoration fails
        }
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const checkLoginStatus = createAsyncThunk(
  "auth/status",
  async (_, { rejectWithValue }) => {
    try {
      const res = await checkLoginStatusApi();
      if (!res.success && res.message?.includes("No access & refresh token")) {
        return { success: false, loggedIn: false, user: null };
      }

      if (!res.success) {
        return rejectWithValue(res.message)  ;
      }

      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",

  async(_, { rejectWithValue, getState, dispatch }) => {
    
    try {
      // Step 1: Get current cart data from Redux state
      const cartState = getState().cart;
      console.log('🛒 Logout - Full cart state:', cartState);
      console.log('🛒 Logout - Cart items array:', cartState.items);
      console.log('🛒 Logout - Cart summary:', cartState.summary);
      console.log('🛒 Logout - Current cart data:', {
        itemsCount: cartState.items.length,
        totalItems: cartState.summary.totalItems,
        totalServices: cartState.summary.totalServices,
        subtotal: cartState.summary.subtotal,
        total: cartState.summary.total
      });

      // Step 2: Save cart data to database (if cart has items) - BEFORE logout API
      console.log('🛒 Logout - Checking if cart has items:', cartState.items.length > 0);
      
      if (cartState.items.length > 0) {
        try {
          console.log('🛒 Logout - Saving cart to database before logout');
          console.log('🛒 Logout - User authenticated:', getState().auth.isAuthenticated);
          console.log('🛒 Logout - User ID:', getState().auth.user?.id);
          await dispatch(saveCart(cartState)).unwrap();
          console.log('✅ Logout - Cart saved to database successfully');
        } catch (cartError) {
          console.error('❌ Logout - Failed to save cart to database:', cartError);
          // Continue with logout even if cart save fails
        }
      } else {
        console.log('🛒 Logout - Cart is empty, skipping database save');
        console.log('🛒 Logout - Cart items length:', cartState.items.length);
        console.log('🛒 Logout - Cart items:', cartState.items);
      }

      // Step 3: Call logout API - this will clear authentication cookies
      const res = await logoutApi();
      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      console.log('✅ Logout - Logout API successful');

      // Step 4: Clear localStorage (Redux Persist) AFTER logout API
      localStorage.removeItem('persist:root');
      console.log('🛒 Logout - localStorage cleared (Redux Persist)');

      // Step 5: Clear cart from Redux state AFTER localStorage is cleared
      dispatch({ type: 'cart/clearCart' });
      console.log('🛒 Logout - Cart cleared from Redux state');

      console.log('✅ Logout - Successfully logged out');
      return data; // { message: "User logged out successfully" }
    } catch (error) {
      console.error('❌ Logout - Error:', error);
      return rejectWithValue(error.message);
    }
  }
)


// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      return await signupApi(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// VERIFY-OTP

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    
    try {
      const data = await verifyOtpApi({ email, otp });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// RESEND OTP
export const resendOtpThunk = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      return await resendOtpApi(email);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// FORGET PASSWORD
export const forgetPasswordThunk = createAsyncThunk(
  "auth/forgetPassword",

  async (email, { rejectWithValue }) => {
    try {
      return await forgetPassword(email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)


// RESET PASSWORD
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ id, token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      return await resetPasswordApi({ id, token, password, confirmPassword });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);