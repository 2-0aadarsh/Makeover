import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewsApi } from "./reviewsApi";

/**
 * Async Thunks
 */

// Verify review token from email link
export const verifyReviewToken = createAsyncThunk(
  "reviews/verifyToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.verifyToken(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid or expired token"
      );
    }
  }
);

// Submit a review or complaint
export const submitReview = createAsyncThunk(
  "reviews/submit",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.submitReview(reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

// Get pending reviews for current user
export const fetchPendingReviews = createAsyncThunk(
  "reviews/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.getPendingReviews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending reviews"
      );
    }
  }
);

// Get user's submitted reviews
export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMine",
  async (params, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.getMyReviews(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// Edit a review
export const editReview = createAsyncThunk(
  "reviews/edit",
  async ({ reviewId, updates }, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.editReview(reviewId, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit review"
      );
    }
  }
);

/**
 * Initial State
 */
const initialState = {
  // Token verification state
  tokenVerification: {
    loading: false,
    error: null,
    bookingData: null,
    isValid: false,
  },
  
  // Review submission state
  submission: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  
  // Pending reviews state
  pendingReviews: {
    loading: false,
    error: null,
    bookings: [],
    count: 0,
  },
  
  // User's submitted reviews state
  myReviews: {
    loading: false,
    error: null,
    reviews: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalReviews: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  
  // Edit state
  editing: {
    loading: false,
    error: null,
    success: false,
  },
};

/**
 * Reviews Slice
 */
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // Reset token verification state
    resetTokenVerification: (state) => {
      state.tokenVerification = initialState.tokenVerification;
    },
    
    // Reset submission state
    resetSubmission: (state) => {
      state.submission = initialState.submission;
    },
    
    // Reset editing state
    resetEditing: (state) => {
      state.editing = initialState.editing;
    },
    
    // Clear all errors
    clearErrors: (state) => {
      state.tokenVerification.error = null;
      state.submission.error = null;
      state.pendingReviews.error = null;
      state.myReviews.error = null;
      state.editing.error = null;
    },
    
    // Decrease pending reviews count (after submission)
    decrementPendingCount: (state) => {
      if (state.pendingReviews.count > 0) {
        state.pendingReviews.count -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify Token
      .addCase(verifyReviewToken.pending, (state) => {
        state.tokenVerification.loading = true;
        state.tokenVerification.error = null;
        state.tokenVerification.isValid = false;
      })
      .addCase(verifyReviewToken.fulfilled, (state, action) => {
        state.tokenVerification.loading = false;
        state.tokenVerification.bookingData = action.payload.data;
        state.tokenVerification.isValid = true;
      })
      .addCase(verifyReviewToken.rejected, (state, action) => {
        state.tokenVerification.loading = false;
        state.tokenVerification.error = action.payload;
        state.tokenVerification.isValid = false;
      })
      
      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.submission.loading = true;
        state.submission.error = null;
        state.submission.success = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submission.loading = false;
        state.submission.success = true;
        state.submission.data = action.payload.data;
        // Decrease pending count
        if (state.pendingReviews.count > 0) {
          state.pendingReviews.count -= 1;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submission.loading = false;
        state.submission.error = action.payload;
        state.submission.success = false;
      })
      
      // Fetch Pending Reviews
      .addCase(fetchPendingReviews.pending, (state) => {
        state.pendingReviews.loading = true;
        state.pendingReviews.error = null;
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.pendingReviews.loading = false;
        state.pendingReviews.bookings = action.payload.data?.bookings || [];
        state.pendingReviews.count = action.payload.data?.count || 0;
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.pendingReviews.loading = false;
        state.pendingReviews.error = action.payload;
      })
      
      // Fetch My Reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.myReviews.loading = true;
        state.myReviews.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews.loading = false;
        state.myReviews.reviews = action.payload.data?.reviews || [];
        state.myReviews.pagination = action.payload.data?.pagination || initialState.myReviews.pagination;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.myReviews.loading = false;
        state.myReviews.error = action.payload;
      })
      
      // Edit Review
      .addCase(editReview.pending, (state) => {
        state.editing.loading = true;
        state.editing.error = null;
        state.editing.success = false;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.editing.loading = false;
        state.editing.success = true;
        // Update the review in myReviews if present (match by _id or reviewId)
        const updatedReview = action.payload.data;
        const id = updatedReview.reviewId || updatedReview._id;
        const index = state.myReviews.reviews.findIndex(
          (r) => (r._id && r._id === id) || (r.reviewId && r.reviewId === id)
        );
        if (index !== -1 && updatedReview) {
          state.myReviews.reviews[index] = {
            ...state.myReviews.reviews[index],
            rating: updatedReview.rating,
            comment: updatedReview.comment,
            isEdited: updatedReview.isEdited,
            editedAt: updatedReview.editedAt,
            editWindowExpiresAt: updatedReview.editWindowExpiresAt,
          };
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        state.editing.loading = false;
        state.editing.error = action.payload;
        state.editing.success = false;
      });
  },
});

// Export actions
export const {
  resetTokenVerification,
  resetSubmission,
  resetEditing,
  clearErrors,
  decrementPendingCount,
} = reviewsSlice.actions;

// Export selectors
export const selectTokenVerification = (state) => state.reviews.tokenVerification;
export const selectSubmission = (state) => state.reviews.submission;
export const selectPendingReviews = (state) => state.reviews.pendingReviews;
export const selectMyReviews = (state) => state.reviews.myReviews;
export const selectEditing = (state) => state.reviews.editing;

export default reviewsSlice.reducer;
