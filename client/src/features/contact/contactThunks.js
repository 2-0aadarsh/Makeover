import { createAsyncThunk } from "@reduxjs/toolkit";

export const sendContactData = createAsyncThunk(
  "contact/sendContactData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/contactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Something went wrong!");
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);
