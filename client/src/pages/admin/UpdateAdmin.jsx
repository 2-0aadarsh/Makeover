import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { fetchAdminById, updateAdmin, resetAdminPassword } from "../../features/admin/admins/adminAdminsThunks";
import { clearAdminDetails } from "../../features/admin/admins/adminAdminsSlice";
import Loader from "../../components/common/Loader/loader.jsx";

/**
 * UpdateAdmin - Page for updating an existing admin
 * Features:
 * - Pre-filled form with existing admin data
 * - Update name, email, status
 * - Optional password reset
 * - Success/error handling
 */
const UpdateAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const currentAdminId = user?.id || user?._id;
  
  const {
    adminDetails,
    detailsLoading,
    detailsError,
    loading,
    error,
  } = useSelector((state) => state.adminAdmins);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    isActive: true,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [isCurrentAdmin, setIsCurrentAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch admin details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchAdminById(id));
    }
    return () => {
      dispatch(clearAdminDetails());
    };
  }, [id, dispatch]);

  // Populate form when admin details are loaded
  useEffect(() => {
    if (adminDetails) {
      setFormData({
        name: adminDetails.name || "",
        email: adminDetails.email || "",
        phoneNumber: adminDetails.phoneNumber || "",
        isActive: adminDetails.isActive !== false,
      });
      
      // Check if this is the current admin
      const adminId = adminDetails.id || adminDetails._id;
      setIsCurrentAdmin(adminId === currentAdminId?.toString());
    }
  }, [adminDetails, currentAdminId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.phoneNumber && formData.phoneNumber.trim() && !/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.password) {
      errors.password = "Password is required";
    } else if (passwordData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.password !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateAdmin({ adminId: id, data: formData })).unwrap();
      setSuccessMessage("Admin updated successfully!");
      setTimeout(() => {
        navigate("/admin/admins");
      }, 2000);
    } catch (err) {
      console.error("Error updating admin:", err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validatePassword()) {
      return;
    }

    try {
      await dispatch(
        resetAdminPassword({
          adminId: id,
          data: {
            password: passwordData.password,
            confirmPassword: passwordData.confirmPassword,
          },
        })
      ).unwrap();
      setSuccessMessage("Password reset successfully!");
      setShowPasswordReset(false);
      setPasswordData({ password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/admins");
  };

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px] flex items-center justify-center">
        <Loader size="large" useCustomGif text="Loading admin details..." />
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4 font-sans">Error: {detailsError}</p>
          <button
            onClick={() => navigate("/admin/admins")}
            className="px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 font-sans"
          >
            Back to Admins
          </button>
        </div>
      </div>
    );
  }

  if (!adminDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-4 font-sans">Admin not found</p>
          <button
            onClick={() => navigate("/admin/admins")}
            className="px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 font-sans"
          >
            Back to Admins
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title */}
      <h1
        className="text-3xl font-bold mb-8 font-sans"
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#CC2B52",
        }}
      >
        Update Admin
      </h1>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-sans">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-sans">{successMessage}</p>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mb-6">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter admin name"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                validationErrors.name ? "border-red-300" : "border-gray-300"
              }`}
              style={{ fontSize: "14px" }}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600 font-sans">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                validationErrors.email ? "border-red-300" : "border-gray-300"
              }`}
              style={{ fontSize: "14px" }}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 font-sans">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                validationErrors.phoneNumber ? "border-red-300" : "border-gray-300"
              }`}
              style={{ fontSize: "14px" }}
            />
            {validationErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 font-sans">
                {validationErrors.phoneNumber}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="mb-6">
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={isCurrentAdmin}
                  className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                />
                <span className="font-sans" style={{ fontSize: "14px" }}>
                  Active
                </span>
              </label>
              {isCurrentAdmin && (
                <span className="text-sm text-gray-500 font-sans">
                  (You cannot change your own status)
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size="small" />
                  Updating...
                </span>
              ) : (
                "Update Admin"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold font-sans"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#292D32",
            }}
          >
            Reset Password
          </h2>
          <button
            type="button"
            onClick={() => {
              setShowPasswordReset(!showPasswordReset);
              setPasswordData({ password: "", confirmPassword: "" });
              setValidationErrors({});
            }}
            className="px-4 py-2 text-[#CC2B52] border border-[#CC2B52] rounded-lg hover:bg-[#CC2B52] hover:text-white transition-colors font-sans"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {showPasswordReset ? "Cancel" : "Reset Password"}
          </button>
        </div>

        {showPasswordReset && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label
                className="block mb-2 font-sans"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                    validationErrors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  style={{ fontSize: "14px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 font-sans">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="mb-4">
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
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans ${
                    validationErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  style={{ fontSize: "14px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateAdmin;
