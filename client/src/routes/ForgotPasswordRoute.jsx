import { useLocation, Navigate, Outlet } from "react-router-dom";

const ForgotPasswordRoute = () => {
  const location = useLocation();

  if (!location.state?.fromLogin) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ForgotPasswordRoute;
