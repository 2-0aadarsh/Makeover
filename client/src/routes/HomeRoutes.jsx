import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader/loader.jsx";

// Layout components (keep these as regular imports since they're used frequently)
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Guards (keep as regular imports)
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import ForgotPasswordRoute from "./ForgotPasswordRoute";
import VerifyEmailRoute from "./VerifyEmailRoute";

// Lazy load page components
const HomePage = lazy(() => import("../pages/home/HomePage"));
const NotFoundPage = lazy(() => import("../pages/errorBoundaries/NotFoundPage"));
const SignupPage = lazy(() => import("../components/common/auth/SignupPage"));
const LoginPage = lazy(() => import("../components/common/auth/LoginPage"));
const EmailVerificationPage = lazy(() => import("../pages/auth/EmailVerificationPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const AboutUsPage = lazy(() => import("../components/common/aboutUs/AboutUsPage"));
const TermsAndConditionsPage = lazy(() => import("../pages/home/TermsAndConditionsPage"));
const PrivacyPolicy = lazy(() => import("../pages/home/PrivacyPolicy"));
const ForgotPasswordPage = lazy(() => import("../components/common/auth/ForgotPasswordPage"));
const MyBookings = lazy(() => import("../components/common/bookings/MyBookings"));

// Loading wrapper component
const LazyWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="large" useCustomGif text="Loading page..." />
    </div>
  }>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
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
        )
      },
      { 
        path: "about", 
        element: (
          <LazyWrapper>
            <AboutUsPage />
          </LazyWrapper>
        )
      },
      { 
        path: "privacy-policy", 
        element: (
          <LazyWrapper>
            <PrivacyPolicy />
          </LazyWrapper>
        )
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
            )
          }
        ],
      },
      { 
        path: "terms-and-conditions", 
        element: (
          <LazyWrapper>
            <TermsAndConditionsPage />
          </LazyWrapper>
        )
      },
      { 
        path: "*", 
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        )
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
            )
          },
          { 
            path: "login", 
            element: (
              <LazyWrapper>
                <LoginPage />
              </LazyWrapper>
            )
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
                )
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
            )
          },
        ],
      },
      { 
        path: "reset-password/:id/:token", 
        element: (
          <LazyWrapper>
            <ResetPasswordPage />
          </LazyWrapper>
        )
      },
      { 
        path: "*", 
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        )
      },
    ],
  },
]);