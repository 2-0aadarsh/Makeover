import { createSlice } from "@reduxjs/toolkit";
import {
  checkLoginStatus,
  completeGoogleSignupThunk,
  forgetPasswordThunk,
  googleLoginThunk,
  loginUser,
  logoutUser,
  resendOtpThunk,
  resetPasswordThunk,
  signupUser,
  verifyOtpThunk,
} from "./authThunks";
import toast from "react-hot-toast";

const SIGNUP_EMAIL_KEY = "pendingSignupEmail";
const SIGNUP_SUCCESS_KEY = "pendingSignupSuccess";

const isBrowser = typeof window !== "undefined";

const getPendingSignupContext = () => {
  if (!isBrowser) {
    return { email: null, success: false };
  }

  const email = sessionStorage.getItem(SIGNUP_EMAIL_KEY);
  const success = sessionStorage.getItem(SIGNUP_SUCCESS_KEY) === "true";
  return {
    email: email || null,
    success,
  };
};

const setPendingSignupContext = (email, success) => {
  if (!isBrowser) return;

  if (success && email) {
    sessionStorage.setItem(SIGNUP_EMAIL_KEY, email);
    sessionStorage.setItem(SIGNUP_SUCCESS_KEY, "true");
  } else {
    sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
    sessionStorage.removeItem(SIGNUP_SUCCESS_KEY);
  }
};

const { email: storedSignupEmail, success: storedSignupSuccess } =
  getPendingSignupContext();

const initialState = {
  user: null,
  userEmail: storedSignupEmail,
  status: "idle",
  error: null,
  isAuthenticated: false,
  signupSuccess: storedSignupSuccess,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
  phoneNumberRequired: false, // Flag for Google OAuth phone number collection
  pendingGoogleUser: null, // Store user data when phone number is required
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.status = "idle";
      state.signupSuccess = false;
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
      state.phoneNumberRequired = false;
      state.pendingGoogleUser = null;
      setPendingSignupContext(null, false);
    },

    clearUserEmail: (state) => {
      state.userEmail = null; // allow manual reset if needed
      setPendingSignupContext(null, false);
    },
  },

  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        console.log("⏳ [Auth Slice] Signup pending...");
        state.status = "loading";
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.error("❌ [Auth Slice] Signup rejected:", action.payload);
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.signupSuccess = false;
        toast.error(state.error);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log(
          "✅ [Auth Slice] Signup fulfilled! Setting signupSuccess = true"
        );
        console.log("📧 [Auth Slice] User email:", action.meta.arg.email);
        state.status = "succeeded";
        state.signupSuccess = true;
        state.userEmail = action.meta.arg.email;
        setPendingSignupContext(action.meta.arg.email, true);
        toast.success(
          action.payload.message ||
            "Signup successful. Check your email for verification."
        );
      })

      // VERIFY OTP
      .addCase(verifyOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store complete user object including phoneNumber: { name, email, phoneNumber }
        state.user = action.payload.user; // comes from backend with phoneNumber
        state.isAuthenticated = true; // user is now logged in after verification
        state.userEmail = null;
        state.signupSuccess = false;
        setPendingSignupContext(null, false);
        toast.success("OTP verified successfully");
      })

      .addCase(resendOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendOtpThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        toast.success(action.payload.message);
      })
      .addCase(resendOtpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store complete user object: { id, name, email, phoneNumber, role }
        state.user = action.payload.user; // comes from backend with phoneNumber and role
        state.isAuthenticated = true;
      })

      // GOOGLE LOGIN
      .addCase(googleLoginThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || "Google login failed");
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        // Check if phone number is required
        if (action.payload.phoneNumberRequired) {
          state.phoneNumberRequired = true;
          state.pendingGoogleUser = action.payload.user;
          state.isAuthenticated = false; // Don't authenticate until phone number is provided
        } else {
          // Phone number exists - complete login
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.phoneNumberRequired = false;
          state.pendingGoogleUser = null;
        }
      })

      // COMPLETE GOOGLE SIGNUP
      .addCase(completeGoogleSignupThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeGoogleSignupThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        toast.error(action.payload || "Failed to complete signup");
      })
      .addCase(completeGoogleSignupThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.phoneNumberRequired = false;
        state.pendingGoogleUser = null;
        toast.success("Signup completed successfully!");
      })

      // CHECK LOGIN STATUS
      .addCase(checkLoginStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Store complete user object including phoneNumber: { id, name, email, phoneNumber, role }
        state.user = action.payload.user; // comes from backend with phoneNumber (fetched from database)
        state.isAuthenticated = action.payload.loggedIn;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        toast.error(`Logout failed: ${state.error}`);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.userEmail = null;
        state.signupSuccess = false;
        setPendingSignupContext(null, false);
        toast.success("Logged out successfully!");
      })

      // FORGET PASSWORD
      .addCase(forgetPasswordThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.forgotPasswordSuccess = false;
        toast.error(state.error);
      })
      .addCase(forgetPasswordThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.forgotPasswordSuccess = true;
        toast.success(action.payload.message);
      })

      // RESET PASSWORD
      .addCase(resetPasswordThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resetPasswordSuccess = true;
        toast.success(action.payload.message || "Password reset successful");
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.resetPasswordSuccess = false;
        toast.error(state.error);
      });
  },
});

export const { resetAuthState } = AuthSlice.actions;

// exporting the Slice/Reducer to be added in the Store
export default AuthSlice.reducer;
