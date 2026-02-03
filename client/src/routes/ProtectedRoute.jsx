/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader/loader";

const ProtectedRoute = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  // Wait until login check finishes (including initial "idle" state)
  // Don't redirect until we know for sure the user is not authenticated
  if (status === "loading" || status === "idle") {
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
