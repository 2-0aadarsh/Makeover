/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = ({ redirectTo = "/" }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  if (status === "loading") return <p>Loading...</p>;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
