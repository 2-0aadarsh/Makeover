/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader/loader";

const ProtectedRoute = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);

  // If we already have a valid session (e.g. from a prior check or client-side nav), render immediately.
  // This avoids getting stuck on "Checking authentication..." when status is still idle/loading due to timing.
  const hasValidSession = isAuthenticated && user;

  // Wait until login check finishes (idle/loading) only when we don't yet have a valid session
  if ((status === "loading" || status === "idle") && !hasValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="large" useCustomGif text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
