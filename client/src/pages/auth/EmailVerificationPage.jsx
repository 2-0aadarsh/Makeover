/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import OTPVerification from "../../components/common/auth/OTPVerification";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpThunk, resendOtpThunk } from "../../features/auth/authThunks";
import { resetAuthState } from "../../features/auth/AuthSlice";
import { useEffect } from "react";

const EmailVerificationPage = () => {
  
  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userEmail, status, error } = useSelector((state) => state.auth);

  // Verify OTP
  const handleVerify = async (otp) => {
    if (!userEmail) return; // guard
    try {
      const result = await dispatch(
        verifyOtpThunk({ email: userEmail, otp })
      ).unwrap();

      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      // 
    }
  };

  // Resend OTP
  const handleResend = () => {
    if (userEmail) dispatch(resendOtpThunk(userEmail));
  };

  // Reset auth state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  return (
    <OTPVerification
      email={userEmail}
      purpose="verification"
      onVerify={handleVerify}
      onResend={handleResend}
      status={status}
      error={error}
    />
  );
};

export default EmailVerificationPage;
