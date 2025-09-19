import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const VerifyEmailRoute = () => {
  const { signupSuccess } = useSelector((state) => state.auth);

  
  if (!signupSuccess) {
    return <Navigate to="/auth/signup" replace />;
  }

  return <Outlet />;
};

export default VerifyEmailRoute;
