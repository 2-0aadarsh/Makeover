/* eslint-disable react/prop-types */
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { completeGoogleSignupThunk, googleLoginThunk } from "../../../features/auth/authThunks";

const FormFooter = ({ accDetails, switchToButton, switchTo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, isAuthenticated, user, phoneNumberRequired, pendingGoogleUser } = useSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSwitch = (switchTo) => {
    navigate(switchTo);
  };

  // Google Login handler
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        await dispatch(googleLoginThunk(codeResponse.code)).unwrap();
      } catch (error) {
        toast.error(error || "Google login failed");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  // Handle phone number required modal
  useEffect(() => {
    if (phoneNumberRequired && pendingGoogleUser) {
      setShowPhoneModal(true);
    }
  }, [phoneNumberRequired, pendingGoogleUser]);

  // Handle redirect after successful Google login/signup
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated && user && !phoneNumberRequired) {
      if (user.role) {
        // Check user role and redirect accordingly
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [status, isAuthenticated, user, phoneNumberRequired, navigate]);

  // Handle phone number and password submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate phone number (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setFormError("Phone number must be 10 digits starting with 6, 7, 8, or 9");
      return;
    }

    // Validate password format
    // eslint-disable-next-line no-useless-escape
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setFormError("Password must be at least 8 characters with uppercase, number, and special character");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!pendingGoogleUser?.id) {
      toast.error("User information not found");
      return;
    }

    try {
      await dispatch(completeGoogleSignupThunk({
        userId: pendingGoogleUser.id,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
      })).unwrap();
      setShowPhoneModal(false);
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setFormError("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(error || "Failed to complete signup");
    }
  };

  return (
    <div className="flex flex-col gap-4 font-inter">
      <div className="social-sign-in flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-[1px] w-2/5 bg-gray-200"></div>
          <p className="text-xs text-gray-500 px-2">or</p>
          <div className="h-[1px] w-2/5 bg-gray-200"></div>
        </div>

        <div className="social-sign-in-box flex items-center justify-center gap-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={status === "loading"}
            className="social-item flex items-center justify-center gap-2 w-1/2 px-3 py-2.5 border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-lg" />
            <span>{status === "loading" ? "Loading..." : "Google"}</span>
          </button>
          {/* <button className="social-item flex items-center justify-center gap-2 w-1/2 px-3 py-2.5 border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors">
            <FaFacebookF className="text-lg text-blue-600" />
            <span>Facebook</span>
          </button> */}
        </div>
      </div>

      <div className="having-an-acc text-xs text-gray-600 text-center font-medium flex items-center justify-center gap-1">
        {accDetails}
        <span
          className="text-[#CC2B52] font-semibold cursor-pointer hover:underline"
          tabIndex={0}
          onClick={() => handleSwitch(switchTo)}
        >
          {switchToButton}
        </span>
      </div>

      <div className="copy-rights text-gray-400 text-[10px] text-center font-medium">
        © MAKEOVER 2025 ALL RIGHTS RESERVED
      </div>

      {/* Phone Number Collection Modal */}
      {showPhoneModal && pendingGoogleUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Complete Your Signup
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please enter your phone number and password to complete your Google signup.
            </p>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{formError}</p>
              </div>
            )}
            
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setPhoneNumber(value);
                        if (formError) setFormError("");
                      }
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 10-digit mobile number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formError) setFormError("");
                    }}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, number, and special character
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (formError) setFormError("");
                    }}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhoneModal(false);
                    setPhoneNumber("");
                    setPassword("");
                    setConfirmPassword("");
                    setFormError("");
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading" || phoneNumber.length !== 10 || !password || !confirmPassword}
                  className="flex-1 px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Submitting..." : "Complete Signup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormFooter;
