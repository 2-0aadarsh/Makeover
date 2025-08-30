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
  import MyBookings from "../components/common/bookings/MyBookings";

  // Guards
  import ProtectedRoute from "./ProtectedRoute";
  import AuthRoute from "./AuthRoute";
import ForgotPasswordRoute from "./ForgotPasswordRoute";
import VerifyEmailRoute from "./VerifyEmailRoute";

  export const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "about", element: <AboutUsPage /> },
        { path: "privacy-policy", element: <PrivacyPolicy /> },
        {
          element: <ProtectedRoute />, // guard here
          children: [{ path: "myBookings", element: <MyBookings /> }],
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
              path: "verify-email", element: <EmailVerificationPage />,
            },
          ],
        },

        { path: "reset-password/:id/:token", element: <ResetPasswordPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);
