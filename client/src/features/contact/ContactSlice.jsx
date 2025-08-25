import { createSlice } from "@reduxjs/toolkit";
import { sendContactData } from "./contactThunks";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        toast.success(action.payload?.message);
      })
      .addCase(sendContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        toast.error(state.error);
      });
  },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
