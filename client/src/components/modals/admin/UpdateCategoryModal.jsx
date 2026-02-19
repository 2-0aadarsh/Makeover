/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const UpdateCategoryModal = ({ category, onConfirm, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: "",
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        displayOrder: category.displayOrder !== undefined ? category.displayOrder.toString() : "",
        image: null,
        imagePreview: category.image || null, // Existing image URL
      });
    }
  }, [category]);

  useBodyScrollLock(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      // Clean up previous preview URL if it was a blob
      if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({
        ...prev,
        image: null,
      }));
    }
  };

  const handleRemoveImage = () => {
    // Clean up preview URL if it's a blob
    if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: category.image || null, // Revert to original image
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (formData.displayOrder && isNaN(formData.displayOrder)) {
      newErrors.displayOrder = "Display order must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name.trim());
    formDataToSubmit.append("description", formData.description.trim());
    formDataToSubmit.append("displayOrder", formData.displayOrder || "0");
    
    // Only append image if a new one was selected
    if (formData.image) {
      formDataToSubmit.append("image", formData.image);
    }

    onConfirm(formDataToSubmit);
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-hidden overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-category-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
<<<<<<< HEAD
        data-modal-scroll
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2
            id="update-category-title"
            className="text-xl font-bold text-[#292D32]"
          >
            Update Category
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Category Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#292D32] mb-2">
              Category Name <span className="text-[#CC2B52]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category name"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#292D32] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52] resize-none"
              placeholder="Enter category description (optional)"
              disabled={loading}
            />
          </div>

          {/* Display Order */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#292D32] mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52] ${
                errors.displayOrder ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
              disabled={loading}
              min="0"
            />
            {errors.displayOrder && (
              <p className="text-red-500 text-sm mt-1">{errors.displayOrder}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#292D32] mb-2">
              Category Image
            </label>
            <div className="space-y-3">
              {/* Current/Preview Image */}
              {formData.imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="category-image-update"
                  disabled={loading}
                />
                <label
                  htmlFor="category-image-update"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {formData.image ? "Change Image" : "Upload New Image"}
                </label>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#B02547] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryModal;
