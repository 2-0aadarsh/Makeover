/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminRoute - Protected route for admin users only
 * 
 * Checks:
 * 1. User is authenticated
 * 2. User role is 'admin'
 * 
 * If not authenticated → redirect to login
 * If authenticated but not admin → redirect to home
 * If admin → allow access to admin routes
 */
const AdminRoute = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);

  // Wait until auth check finishes
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC2B52] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Authenticated but not admin → redirect to home
  if (user?.role !== "admin") {
    console.warn("⚠️ Non-admin user attempted to access admin route");
    return <Navigate to="/" replace />;
  }

  // Admin user → allow access
  return <Outlet />;
};

export default AdminRoute;
