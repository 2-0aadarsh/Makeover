import { createSlice } from "@reduxjs/toolkit";
import { checkLoginStatus, forgetPasswordThunk, loginUser, logoutUser, resendOtpThunk, resetPasswordThunk, signupUser, verifyOtpThunk } from "./authThunks";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  userEmail: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  signupSuccess: false,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
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
    },

    clearUserEmail: (state) => {
      state.userEmail = null; // allow manual reset if needed
    },
  },

  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.signupSuccess = false;
        toast.error(state.error);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.signupSuccess = true;
        state.userEmail = action.meta.arg.email;
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
        state.user = action.payload.user; // comes from backend
        state.isAuthenticated = true; // user is now logged in after verification
        state.userEmail = null;
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
        state.user = action.payload.user;
        state.isAuthenticated = true;
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
        state.user = action.payload.user;
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