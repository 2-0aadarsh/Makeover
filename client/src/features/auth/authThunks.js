import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkLoginStatusApi, forgetPassword, loginApi, logoutApi, resendOtpApi, resetPasswordApi, signupApi, verifyOtpApi } from "./authApi";

export const loginUser = createAsyncThunk(
  "auth/login", 
  
  async(credentials, { rejectWithValue })=>{
    try {
      return await loginApi(credentials)
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

  async(_, { rejectWithValue }) => {
    
    try {
      const res = await logoutApi();
      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data; // { message: "User logged out successfully" }
    } catch (error) {
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