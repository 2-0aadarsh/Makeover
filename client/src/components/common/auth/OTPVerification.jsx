

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import Button from "../../ui/Button";

const OTPVerification = ({
  email,
  phone,
  purpose = "verification",
  onVerify,
  onResend,
  resendDelay = 300,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(resendDelay);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  // Purpose messages
  const purposeMessages = {
    verification: "Email Verification",
    passwordReset: "Password Reset",
    phoneVerification: "Phone Verification",
    twoFactor: "Two-Factor Authentication",
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Clear error when user types
    if (error) setError("");
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };



  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 6) {
          newOtp[i] = pasteData[i];
        }
      }
      setOtp(newOtp);
    }
  };

  // Handle verification
  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    if (!/^\d+$/.test(otpString)) {
      setError("OTP must contain only numbers");
      return;
    }

    setIsSubmitting(true);
    try {
      await onVerify(otpString);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setCountdown(resendDelay);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
    try {
      await onResend();
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
  };

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6 border-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#CC2B52] mb-2">
          {purposeMessages[purpose] || "OTP Verification"}
        </h2>

        <p className="text-gray-600 mb-4">
          We&apos;ve sent a 6-digit verification code to
        </p>

        {email && (
          <p className="font-semibold text-lg text-[#313957] mb-1">{email}</p>
        )}

        {phone && (
          <p className="font-semibold text-lg text-[#313957]">+{phone}</p>
        )}
      </div>

      {/* OTP Input Fields */}
      <div className="mb-6">
        <div className="flex justify-center space-x-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`w-12 h-12 text-center text-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          content={isSubmitting ? "Verifying..." : "Verify"}
          css="w-full py-3 rounded-lg font-bold text-white hover:bg-[#CC2B52]/90 transition-all"
          style={{ backgroundColor: "#CC2B52" }}
          onClickFunction={handleVerify}
          disabled={isSubmitting || otp.join("").length !== 6}
        />

        <div className="text-center mt-4">
          <p className="text-gray-600">
            {countdown > 0 ? (
              `Resend OTP in ${countdown} seconds`
            ) : (
              <button
                onClick={handleResend}
                className="text-[#CC2B52] font-medium hover:underline"
                disabled={countdown > 0}
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;