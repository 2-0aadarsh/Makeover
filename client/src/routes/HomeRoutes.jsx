import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";

import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignupPage from "../components/common/SignupPage";
import LoginPage from "../components/common/LoginPage";
<<<<<<< HEAD

import AuthLayout from "../components/layout/AuthLayout";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import GalleryPage from "../components/common/home/GalleryPage";


=======
>>>>>>> parent of cd263de (fifth commit - designed opt verification)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      // Add error boundary if needed
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
