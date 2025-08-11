import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";

import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignupPage from "../components/common/SignupPage";
import LoginPage from "../components/common/LoginPage";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import AuthLayout from "../components/layout/AuthLayout";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
=======
import GalleryPage from "../components/common/home/GalleryPage";
>>>>>>> Stashed changes
=======
import GalleryPage from "../components/common/home/GalleryPage";
>>>>>>> Stashed changes
=======
import GalleryPage from "../components/common/home/GalleryPage";
>>>>>>> Stashed changes

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      // { path: "signup", element: <SignupPage /> },
      // { path: "login", element: <LoginPage /> },
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
