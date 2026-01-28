import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../features/admin/admins/adminAdminsThunks";
import Loader from "../../components/common/Loader/loader.jsx";

/**
 * CreateAdmin - Page for creating a new admin
 * Features:
 * - Form validation
 * - Success/error handling
 * - Redirects to list after success
 */
const CreateAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.adminAdmins);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

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

    if (!formData.phoneNumber || !formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
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
      await dispatch(createAdmin(formData)).unwrap();
      setSuccessMessage(
        "Admin created successfully! An onboarding email has been sent to the new admin. They will need to complete onboarding before they can login."
      );
      setTimeout(() => {
        navigate("/admin/admins");
      }, 4000);
    } catch (err) {
      // Error message will be displayed from Redux state
      // The actual error message from backend will be shown
      console.error("Error creating admin:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/admins");
  };

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
        Create New Admin
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
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
              Phone Number <span className="text-red-500">*</span>
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

          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-sans">
              <strong>Note:</strong> The new admin will receive an onboarding email with a secure link. 
              They will set their password during the onboarding process.
            </p>
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
                  Creating...
                </span>
              ) : (
                "Create Admin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
