import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const VerifyEmailRoute = () => {
  const { userEmail } = useSelector((state) => state.auth);
  const hasVerificationContext = Boolean(userEmail);

  if (!hasVerificationContext) {
    return <Navigate to="/auth/signup" replace />;
  }

  return <Outlet />;
};

export default VerifyEmailRoute;
