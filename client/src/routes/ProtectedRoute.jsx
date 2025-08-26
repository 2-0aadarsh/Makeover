/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  // wait until login check finishes
  if (status === "loading") return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
