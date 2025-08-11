import { useLocation, useNavigate } from "react-router-dom";
import OTPVerification from "../../components/common/auth/OTPVerification";
import  useVerifyOtp  from "../../hooks/useVerifyOtp";

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail; // safely passed via navigate()
  


  const { verifyOtp, loading, error } = useVerifyOtp();

  const handleVerify = async (otp) => {
    const result = await verifyOtp({ email: userEmail, otp });

    if (result) {
      // Redirect to dashboard or show success
      navigate("/");
    } else {
      throw new Error("Invalid OTP"); // This will show error inside OTPVerification
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <OTPVerification
      email={userEmail}
      purpose="verification"
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
};

export default EmailVerificationPage;
 