import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "@reduxjs/toolkit";

import AuthReducer from "../features/auth/AuthSlice";
import ContactReducer from "../features/contact/ContactSlice";
import CartReducer from "../features/cart/cartSlice";

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["cart"], // Only persist cart data, not auth/contact
};

// Root reducer
const rootReducer = combineReducers({
  auth: AuthReducer,
  contact: ContactReducer,
  cart: CartReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
