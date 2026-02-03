import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollToTop from "../../provider/ScrollToTop";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import ReviewToast from "../notifications/ReviewToast";

/**
 * AppLayout - Layout for user-facing pages
 * Redirects admin users to admin dashboard if they try to access user routes
 */
const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);

  // Redirect admins away from user routes
  useEffect(() => {
    // Wait for auth check to complete
    if (status === "loading") return;

    // If user is authenticated and is an admin, redirect to admin dashboard
    if (isAuthenticated && user?.role === "admin") {
      console.log("⚠️ Admin user detected on user route:", location.pathname);
      console.log("🔄 Redirecting to admin dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, status, navigate, location.pathname]);

  // Don't render user UI if admin (prevent flash of wrong UI)
  // Show loading state while checking, or if confirmed admin
  if (status === "loading" || (status !== "loading" && isAuthenticated && user?.role === "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC2B52] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {status === "loading" ? "Loading..." : "Redirecting to admin dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-16 w-full">
        <Outlet />
      </main>
      <Footer />

      {/* Toast notifications for pending reviews - only for authenticated users */}
      {isAuthenticated && <ReviewToast />}

      <ScrollRestoration />
    </div>
  );
};

export default AppLayout;
