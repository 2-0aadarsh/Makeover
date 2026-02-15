import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewsApi } from "../reviews/reviewsApi";

/**
 * Fetch published testimonials (public, no auth)
 */
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.getTestimonials(params || {});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load testimonials"
      );
    }
  }
);

/**
 * Fetch testimonial statistics (public, no auth)
 */
export const fetchTestimonialStats = createAsyncThunk(
  "testimonials/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.getTestimonialStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load statistics"
      );
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  stats: {
    data: null,
    loading: false,
    error: null,
  },
};

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearTestimonialsError: (state) => {
      state.error = null;
      state.stats.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload?.data?.testimonials ?? [];
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load testimonials";
        state.list = [];
      })
      // Fetch stats
      .addCase(fetchTestimonialStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchTestimonialStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats.error = null;
        state.stats.data = action.payload?.data ?? null;
      })
      .addCase(fetchTestimonialStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload ?? "Failed to load statistics";
        state.stats.data = null;
      });
  },
});

export const { clearTestimonialsError } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
