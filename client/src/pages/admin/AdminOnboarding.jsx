import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { onboardingApi } from "../../features/admin/admins/adminAdminsApi";
import Loader from "../../components/common/Loader/loader.jsx";

/**
 * AdminOnboarding - Page for new admins to complete onboarding
 * Features:
 * - Validates onboarding token from URL
 * - Shows password setup form
 * - Handles form submission
 * - Redirects to login after success
 */
const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError("Onboarding token is missing. Please check your email for the complete link.");
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        setValidating(true);
        const response = await onboardingApi.validateToken(token);
        setAdminData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Invalid or expired onboarding token. Please contact the admin who created your account.");
      } finally {
        setLoading(false);
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onboardingApi.completeOnboarding({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      // Show success message briefly before redirecting
      setError(null);
      setTimeout(() => {
        navigate("/auth/login", {
          state: {
            message: "Onboarding completed successfully! Please login with your email and password.",
          },
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to complete onboarding. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading || validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="large" useCustomGif text="Validating onboarding link..." />
        </div>
      </div>
    );
  }

  if (error && !adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
              Invalid Onboarding Link
            </h1>
            <p className="text-gray-600 font-sans">{error}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 font-sans">
              <strong>What to do:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside font-sans">
              <li>Contact the admin who created your account</li>
              <li>Request a new onboarding link</li>
              <li>Make sure you're using the complete link from your email</li>
            </ul>
          </div>
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full px-6 py-3 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors font-sans font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Success Message (if just completed) */}
        {!error && submitting && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm font-sans">
              Onboarding completed! Redirecting to login...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#CC2B52] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
            Complete Your Onboarding
          </h1>
          <p className="text-gray-600 font-sans">
            Welcome, <strong>{adminData?.name}</strong>! Please set up your password to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password Field */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                  validationErrors.password ? "border-red-300" : "border-gray-300"
                }`}
                style={{ fontSize: "14px" }}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={submitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 font-sans">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                  validationErrors.confirmPassword
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                style={{ fontSize: "14px" }}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={submitting}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 font-sans">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-sans">
              <strong>Security:</strong> This link can only be used once. After setting your password, 
              you'll be able to login with your email and password.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans font-semibold"
            style={{ fontSize: "16px" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size="small" />
                Completing Onboarding...
              </span>
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOnboarding;
