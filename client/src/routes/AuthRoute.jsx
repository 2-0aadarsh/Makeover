/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader/loader.jsx";

const AuthRoute = ({ redirectTo = "/" }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="medium" useCustomGif text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
