import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader/loader.jsx";

// Layout components (keep these as regular imports since they're used frequently)
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Guards (keep as regular imports)
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import ForgotPasswordRoute from "./ForgotPasswordRoute";
import VerifyEmailRoute from "./VerifyEmailRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

// Lazy load page components
const HomePage = lazy(() => import("../pages/home/HomePage"));
const NotFoundPage = lazy(() =>
  import("../pages/errorBoundaries/NotFoundPage")
);
const SignupPage = lazy(() => import("../components/common/auth/SignupPage"));
const LoginPage = lazy(() => import("../components/common/auth/LoginPage"));
const EmailVerificationPage = lazy(() =>
  import("../pages/auth/EmailVerificationPage")
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const AboutUsPage = lazy(() =>
  import("../components/common/aboutUs/AboutUsPage")
);
const TermsAndConditionsPage = lazy(() =>
  import("../pages/home/TermsAndConditionsPage")
);
const PrivacyPolicy = lazy(() => import("../pages/home/PrivacyPolicy"));
const ForgotPasswordPage = lazy(() =>
  import("../components/common/auth/ForgotPasswordPage")
);
const AdminOnboarding = lazy(() => import("../pages/admin/AdminOnboarding"));
const MyBookings = lazy(() =>
  import("../components/common/bookings/BookingPage")
);
const MyBookingsPage = lazy(() => import("../pages/MyBookingsPage"));
const BookingDetailsPage = lazy(() => import("../pages/BookingDetailsPage"));
const CartPage = lazy(() => import("../components/common/cart/CartPage"));
const OrderSuccess = lazy(() =>
  import("../components/common/bookings/OrderSuccess")
);
const AddressManagement = lazy(() => import("../pages/AddressManagement"));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("../components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const BookingsAndCustomers = lazy(() => import("../pages/admin/BookingsAndCustomers"));
const AdminBookingDetails = lazy(() => import("../pages/admin/AdminBookingDetails"));
const AdminEnquiries = lazy(() => import("../pages/admin/AdminEnquiries"));
const AdminServices = lazy(() => import("../pages/admin/AdminServices"));
const CreateCategoryService = lazy(() => import("../pages/admin/CreateCategoryService"));
const AdminReviews = lazy(() => import("../pages/admin/AdminReviews"));
const UpdateService = lazy(() => import("../pages/admin/UpdateService"));
const AdminAdmins = lazy(() => import("../pages/admin/AdminAdmins"));
const CreateAdmin = lazy(() => import("../pages/admin/CreateAdmin"));
const UpdateAdmin = lazy(() => import("../pages/admin/UpdateAdmin"));

// Loading wrapper component
const LazyWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" useCustomGif text="Loading page..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  // Admin routes - Must be before other routes to prevent conflicts
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        path: "",
        element: (
          <LazyWrapper>
            <AdminLayout />
          </LazyWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <LazyWrapper>
                <AdminDashboard />
              </LazyWrapper>
            ),
          },
          {
            path: "services",
            element: (
              <LazyWrapper>
                <AdminServices />
              </LazyWrapper>
            ),
          },
          {
            path: "categories",
            element: <Navigate to="/admin/services?tab=categories" replace />,
          },
          {
            path: "services/create",
            element: (
              <LazyWrapper>
                <CreateCategoryService />
              </LazyWrapper>
            ),
          },
          {
            path: "services/update/:id",
            element: (
              <LazyWrapper>
                <UpdateService />
              </LazyWrapper>
            ),
          },
          {
            path: "bookings",
            element: (
              <LazyWrapper>
                <BookingsAndCustomers />
              </LazyWrapper>
            ),
          },
          {
            path: "bookings/:id",
            element: (
              <LazyWrapper>
                <AdminBookingDetails />
              </LazyWrapper>
            ),
          },
          {
            path: "enquiries",
            element: (
              <LazyWrapper>
                <AdminEnquiries />
              </LazyWrapper>
            ),
          },
          {
            path: "reviews",
            element: (
              <LazyWrapper>
                <AdminReviews />
              </LazyWrapper>
            ),
          },
          {
            path: "admins",
            element: (
              <LazyWrapper>
                <AdminAdmins />
              </LazyWrapper>
            ),
          },
          {
            path: "admins/create",
            element: (
              <LazyWrapper>
                <CreateAdmin />
              </LazyWrapper>
            ),
          },
          {
            path: "admins/update/:id",
            element: (
              <LazyWrapper>
                <UpdateAdmin />
              </LazyWrapper>
            ),
          },
        ],
      },
    ],
  },

  // Public and user routes
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <HomePage />
          </LazyWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <LazyWrapper>
            <AboutUsPage />
          </LazyWrapper>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <LazyWrapper>
            <PrivacyPolicy />
          </LazyWrapper>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "myBookings",
            element: (
              <LazyWrapper>
                <MyBookings />
              </LazyWrapper>
            ),
          },
          {
            path: "addresses",
            element: (
              <LazyWrapper>
                <AddressManagement />
              </LazyWrapper>
            ),
          },
          {
            path: "my-bookings",
            element: (
              <LazyWrapper>
                <MyBookingsPage />
              </LazyWrapper>
            ),
          },
          {
            path: "my-bookings/:id",
            element: (
              <LazyWrapper>
                <BookingDetailsPage />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: "Cart",
        element: (
          <LazyWrapper>
            <CartPage />
          </LazyWrapper>
        ),
      },
      {
        path: "order-success",
        element: (
          <LazyWrapper>
            <OrderSuccess />
          </LazyWrapper>
        ),
      },
      {
        path: "terms-and-conditions",
        element: (
          <LazyWrapper>
            <TermsAndConditionsPage />
          </LazyWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        ),
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        element: <AuthRoute />,
        children: [
          {
            path: "signup",
            element: (
              <LazyWrapper>
                <SignupPage />
              </LazyWrapper>
            ),
          },
          {
            path: "login",
            element: (
              <LazyWrapper>
                <LoginPage />
              </LazyWrapper>
            ),
          },
          {
            element: <ForgotPasswordRoute />,
            children: [
              {
                path: "forgot-password",
                element: ( 
                  <LazyWrapper>
                    <ForgotPasswordPage />
                  </LazyWrapper>
                ),
              },
            ],
          },
        ],
      },
      {
        element: <VerifyEmailRoute />,
        children: [
          {
            path: "verify-email",
            element: (
              <LazyWrapper>
                <EmailVerificationPage />
              </LazyWrapper>
            ),
          },
        ],
      },
      {
        path: "reset-password/:id/:token",
        element: (
          <LazyWrapper>
            <ResetPasswordPage />
          </LazyWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  // Public onboarding route (token-based, no auth required)
  {
    path: "/admin/onboard",
    element: (
      <LazyWrapper>
        <AdminOnboarding />
      </LazyWrapper>
    ),
  },
]);
