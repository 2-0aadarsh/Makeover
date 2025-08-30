import { configureStore } from "@reduxjs/toolkit"

import AuthReducer from "../features/auth/AuthSlice"
import ContactReducer from "../features/contact/ContactSlice"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    contact : ContactReducer,
  },
});
