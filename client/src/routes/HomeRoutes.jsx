//

import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/home/HomePage";
import GalleryPage from "../components/common/home/GalleryPage";
import ContactPage from "../pages/home/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignupPage from "../components/common/SignupPage";
import LoginPage from "../components/common/LoginPage";
import AuthLayout from "../components/layout/AuthLayout";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AboutUsPage from "../components/common/aboutUs/AboutUsPage";
import TermsAndConditionsPage from "../pages/home/TermsAndConditionsPage";
import PrivacyPolicy from "../pages/home/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "about", element: <AboutUsPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-and-conditions", element: <TermsAndConditionsPage /> },
      // Add error boundary if needed
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />, // Different layout for auth pages
    children: [
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "verify-email", element: <EmailVerificationPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
]);
