import { createAsyncThunk } from "@reduxjs/toolkit";
const backendurl = import.meta.env.VITE_BACKEND_URL;

export const sendContactData = createAsyncThunk(
  "contact/sendContactData",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch( `${backendurl}/contactUs`, {
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
