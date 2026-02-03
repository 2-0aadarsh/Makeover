import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "@reduxjs/toolkit";

import AuthReducer from "../features/auth/AuthSlice";
import ContactReducer from "../features/contact/ContactSlice";
import CartReducer from "../features/cart/cartSlice";
import PaymentReducer from "../features/payment/paymentSlice";
import AddressReducer from "../features/address/addressSlice";
import BookingReducer from "../features/booking/bookingSlice";
import ServiceabilityReducer from "../features/serviceability/serviceabilitySlice";
import AdminDashboardReducer from "../features/admin/dashboard/adminDashboardSlice";
import AdminBookingsReducer from "../features/admin/bookings/adminBookingsSlice";
import AdminCustomersReducer from "../features/admin/customers/adminCustomersSlice";
import AdminEnquiriesReducer from "../features/admin/enquiries/adminEnquiriesSlice";
import AdminCategoriesReducer from "../features/admin/categories/adminCategoriesSlice";
import AdminServicesReducer from "../features/admin/services/adminServicesSlice";
import AdminReviewsReducer from "../features/admin/reviews/adminReviewsSlice";
import AdminAdminsReducer from "../features/admin/admins/adminAdminsSlice";
import AdminSiteSettingsReducer from "../features/admin/siteSettings/siteSettingsSlice";
import ReviewsReducer from "../features/reviews/reviewsSlice";
import NotificationsReducer from "../features/notifications/notificationsSlice";
import TestimonialsReducer from "../features/testimonials/testimonialsSlice";

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["cart", "booking"], // Persist cart and booking data
};

// Root reducer
const rootReducer = combineReducers({
  auth: AuthReducer,
  contact: ContactReducer,
  cart: CartReducer,
  payment: PaymentReducer,
  address: AddressReducer,
  booking: BookingReducer,
  serviceability: ServiceabilityReducer,
  reviews: ReviewsReducer,
  notifications: NotificationsReducer,
  testimonials: TestimonialsReducer,
  adminDashboard: AdminDashboardReducer,
  adminBookings: AdminBookingsReducer,
  adminCustomers: AdminCustomersReducer,
  adminEnquiries: AdminEnquiriesReducer,
  adminCategories: AdminCategoriesReducer,
  adminServices: AdminServicesReducer,
  adminReviews: AdminReviewsReducer,
  adminAdmins: AdminAdminsReducer,
  adminSiteSettings: AdminSiteSettingsReducer,
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
