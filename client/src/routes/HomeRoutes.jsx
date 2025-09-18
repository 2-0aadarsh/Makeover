import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/home/HomePage";
import NotFoundPage from "../pages/errorBoundaries/NotFoundPage";
import SignupPage from "../components/common/auth/SignupPage";
import LoginPage from "../components/common/auth/LoginPage";
import AuthLayout from "../components/layout/AuthLayout";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AboutUsPage from "../components/common/aboutUs/AboutUsPage";
import TermsAndConditionsPage from "../pages/home/TermsAndConditionsPage";
import PrivacyPolicy from "../pages/home/PrivacyPolicy";
import ForgotPasswordPage from "../components/common/auth/ForgotPasswordPage";
import BookingPage from "../components/common/bookings/BookingPage";
import CartPage from "../components/common/cart/CartPage";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import ForgotPasswordRoute from "./ForgotPasswordRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutUsPage /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "cart", element: <CartPage /> },
      { path: "booking", element: <BookingPage /> },
      {
        element: <ProtectedRoute />, // guard here
        children: [],
      },
      { path: "terms-and-conditions", element: <TermsAndConditionsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        element: <AuthRoute />,
        children: [
          { path: "signup", element: <SignupPage /> },
          { path: "login", element: <LoginPage /> },
          {
            element: <ForgotPasswordRoute />,
            children: [
              { path: "forgot-password", element: <ForgotPasswordPage /> },
            ],
          },
          {
            path: "verify-email",
            element: <EmailVerificationPage />,
          },
        ],
      },

      { path: "reset-password/:id/:token", element: <ResetPasswordPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
