import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllCategories } from "../../features/admin/categories/adminCategoriesThunks";
import { fetchServiceById } from "../../features/admin/services/adminServicesThunks";
import { adminServicesApi } from "../../features/admin/services/adminServicesApi";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";

/**
 * UpdateService - Page for updating existing services
 * Features:
 * - Pre-filled form with existing service data
 * - Image preview and update
 * - Service preview card
 * - Matches Figma design specifications
 */
const UpdateService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    bodyContent: "",
    price: "",
    duration: "",
    taxIncluded: true, // Default to true
    ctaContent: "Add",
    serviceType: "Standard", // Default to "Standard" (maps to "Regular" tab)
    cardType: "Vertical",
    images: [],
    imagePreviews: [],
    existingImages: [], // Store existing image URLs
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { categories } = useSelector((state) => state.adminCategories);
  const { serviceDetails, detailsLoading, detailsError } = useSelector((state) => state.adminServices);

  // Fetch categories and service details on mount
  useEffect(() => {
    dispatch(fetchAllCategories({ limit: 100 }));
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [id, dispatch]);

  // Populate form when service details are loaded
  useEffect(() => {
    if (serviceDetails) {
      const service = serviceDetails;
      setServiceForm({
        categoryId: service.categoryId?._id || service.categoryId || service.category?.id || "",
        name: service.name || "",
        description: service.description || "",
        bodyContent: service.bodyContent || "",
        price: service.price?.toString() || "",
        duration: service.duration || "",
        taxIncluded: service.taxIncluded !== undefined ? service.taxIncluded : true,
        ctaContent: service.ctaContent || "Add",
        serviceType: service.serviceType || "Standard",
        cardType: service.cardType || "Vertical",
        images: [],
        imagePreviews: [],
        existingImages: service.images || service.image || [],
      });
    }
  }, [serviceDetails]);

  // Handle service images upload
  const handleServiceImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const previews = files.map(file => URL.createObjectURL(file));
      setServiceForm({
        ...serviceForm,
        images: [...serviceForm.images, ...files],
        imagePreviews: [...serviceForm.imagePreviews, ...previews],
      });
    }
  };

  // Remove new image (from previews)
  const removeNewImage = (index) => {
    URL.revokeObjectURL(serviceForm.imagePreviews[index]);
    setServiceForm({
      ...serviceForm,
      images: serviceForm.images.filter((_, i) => i !== index),
      imagePreviews: serviceForm.imagePreviews.filter((_, i) => i !== index),
    });
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setServiceForm({
      ...serviceForm,
      existingImages: serviceForm.existingImages.filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!serviceForm.categoryId) {
        throw new Error("Please select a category");
      }
      if (!serviceForm.name || !serviceForm.name.trim()) {
        throw new Error("Service name is required");
      }
      if (!serviceForm.description || !serviceForm.description.trim()) {
        throw new Error("Service description is required");
      }
      if (!serviceForm.price) {
        throw new Error("Service price is required");
      }
      // Images are optional for update (can keep existing)
      if (serviceForm.images.length === 0 && serviceForm.existingImages.length === 0) {
        throw new Error("At least one service image is required");
      }

      // Convert price format (e.g., "12K" to 12000)
      let priceValue = serviceForm.price;
      if (typeof priceValue === 'string') {
        priceValue = priceValue.trim().toUpperCase();
        if (priceValue.endsWith('K')) {
          priceValue = parseFloat(priceValue.replace('K', '')) * 1000;
        } else {
          priceValue = parseFloat(priceValue);
        }
        if (isNaN(priceValue)) {
          throw new Error("Invalid price format. Use numbers or format like '12K'");
        }
      }

      const formData = new FormData();
      formData.append("categoryId", serviceForm.categoryId);
      formData.append("name", serviceForm.name.trim());
      const descriptionValue = (serviceForm.description && serviceForm.description.trim()) 
        ? serviceForm.description.trim() 
        : (serviceForm.bodyContent && serviceForm.bodyContent.trim() 
          ? serviceForm.bodyContent.trim() 
          : "");
      formData.append("description", descriptionValue);
      formData.append("bodyContent", serviceForm.bodyContent || "");
      formData.append("price", priceValue.toString());
      formData.append("duration", serviceForm.duration || "");
      formData.append("taxIncluded", serviceForm.taxIncluded ? "true" : "false");
      formData.append("ctaContent", serviceForm.ctaContent);
      // Only include serviceType if CTA Content is "Add"
      if (serviceForm.ctaContent === "Add") {
        formData.append("serviceType", serviceForm.serviceType || "Standard");
      }
      formData.append("cardType", serviceForm.cardType);
      
      // Append new images only if provided
      serviceForm.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await adminServicesApi.updateService(id, formData);
      
      if (response.success) {
        // Clean up preview URLs
        serviceForm.imagePreviews.forEach(preview => {
          URL.revokeObjectURL(preview);
        });
        setSuccessMessage("Service updated successfully!");
        setTimeout(() => {
          navigate("/admin/services");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to update service");
      }
    } catch (err) {
      setError(err.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  // Format price for preview
  const formatPriceForPreview = (price) => {
    if (!price) return "N/A";
    const numPrice = typeof price === 'string' ? parseFloat(price.replace('K', '')) * (price.includes('K') ? 1000 : 1) : price;
    if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(0)}K`;
    }
    return numPrice.toString();
  };

  // Get preview image
  const getPreviewImage = () => {
    if (serviceForm.imagePreviews.length > 0) {
      return serviceForm.imagePreviews[0];
    }
    if (serviceForm.existingImages.length > 0) {
      return serviceForm.existingImages[0];
    }
    return null;
  };

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px] flex items-center justify-center">
        <Loader size="large" useCustomGif text="Loading service details..." />
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4 font-sans">Error: {detailsError}</p>
          <button
            onClick={() => navigate("/admin/services")}
            className="px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!serviceDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-4">Service not found</p>
          <button
            onClick={() => navigate("/admin/services")}
            className="px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title */}
      <h1
        className="text-3xl font-bold mb-6 font-sans"
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#292D32",
        }}
      >
        Services
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

      {/* Update Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2
          className="text-2xl font-bold mb-6 font-sans"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#292D32",
          }}
        >
          Update
        </h2>

        <form onSubmit={handleServiceSubmit}>
          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Select Category Dropdown */}
            <Select
              label="Select Category"
              value={serviceForm.categoryId}
              onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
              options={[
                { value: "", label: "Select Category" },
                ...categories.map((category) => ({
                  value: category.id || category._id,
                  label: category.name,
                })),
              ]}
              placeholder="Select Category"
              required
              height="44px"
            />

            {/* Select Service Dropdown - Read-only showing current service */}
            <div>
              <label
                className="block mb-2 font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#292D32",
                }}
              >
                Select Service
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={serviceForm.name || "Loading..."}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#292D32",
                    height: "44px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Fields with Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Preview Card */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#292D32",
                  }}
                >
                  Preview
                </h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Service Image */}
                  {getPreviewImage() ? (
                    <img
                      src={getPreviewImage()}
                      alt={serviceForm.name || "Service"}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        console.error('❌ Preview image load failed:', getPreviewImage());
                        console.error('Error details:', e);
                        e.target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'w-full h-64 bg-red-50 flex items-center justify-center';
                        errorDiv.innerHTML = '<span class="text-red-600 text-sm">Image failed to load</span>';
                        e.target.parentNode.appendChild(errorDiv);
                      }}
                      onLoad={() => {
                        console.log('✅ Preview image loaded:', getPreviewImage());
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Service Details */}
                  <div className="p-4">
                    <h4
                      className="text-xl font-bold mb-2 font-sans"
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#292D32",
                      }}
                    >
                      {serviceForm.name || "Service Name"}
                    </h4>
                    <p
                      className="text-sm mb-3 text-gray-600 line-clamp-3 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                      }}
                    >
                      {serviceForm.description || serviceForm.bodyContent || "Service description will appear here"}
                    </p>
                    <p
                      className="text-sm font-semibold mb-4 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Price Estimate: {formatPriceForPreview(serviceForm.price)}
                    </p>
                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 transition-colors font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {serviceForm.ctaContent || "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields in Two Columns */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column Fields */}
                <div className="space-y-4">
                  {/* Upload/Change Image */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Upload/Change Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleServiceImagesChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#CC2B52] file:text-white hover:file:bg-[#CC2B52]/90 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                    />
                    {/* Existing Images */}
                    {serviceForm.existingImages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {serviceForm.existingImages.map((imgUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imgUrl}
                              alt={`Existing ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                console.error('❌ Image load failed:', imgUrl);
                                console.error('Error details:', e);
                                // Show placeholder on error
                                e.target.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log('✅ Image loaded successfully:', imgUrl);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* New Image Previews */}
                    {serviceForm.imagePreviews.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {serviceForm.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`New ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Body Content
                    </label>
                    <textarea
                      value={serviceForm.bodyContent}
                      onChange={(e) => setServiceForm({ ...serviceForm, bodyContent: e.target.value })}
                      placeholder="Service body content"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                    />
                  </div>

                  <Select
                    label="CTA Content"
                    value={serviceForm.ctaContent}
                    onChange={(e) => setServiceForm({ ...serviceForm, ctaContent: e.target.value })}
                    options={[
                      { value: "Add", label: "Add" },
                      { value: "Enquire Now", label: "Enquire Now" },
                    ]}
                    placeholder="Select"
                    height="44px"
                  />

                  {/* Service Type - Only show when CTA Content is "Add" */}
                  {serviceForm.ctaContent === "Add" && (
                    <Select
                      label="Service Type"
                      value={serviceForm.serviceType}
                      onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                      options={[
                        { value: "Standard", label: "Regular" },
                        { value: "Premium", label: "Premium" },
                        { value: "Bridal", label: "Bridal" },
                        { value: "Classic", label: "Classic" },
                      ]}
                      placeholder="Select"
                      required
                      height="44px"
                    />
                  )}

                  <Select
                    label="Choose Type Of Card"
                    value={serviceForm.cardType}
                    onChange={(e) => setServiceForm({ ...serviceForm, cardType: e.target.value })}
                    options={[
                      { value: "Vertical", label: "Vertical" },
                      { value: "Horizontal", label: "Horizontal" },
                    ]}
                    placeholder="Select"
                    height="44px"
                  />
                </div>

                {/* Right Column Fields */}
                <div className="space-y-4">
                  {/* Title/Heading */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Title/Heading
                    </label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      placeholder="Bridal Makeup"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Price
                    </label>
                    <input
                      type="text"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      placeholder="12K or 12000"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                      required
                    />
                  </div>

                  {/* Duration Of Service */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Duration Of Service
                    </label>
                    <input
                      type="text"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      placeholder="60 mins"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                    />
                  </div>

                  <Checkbox
                    label="Tax Included"
                    helperText="Check if the price includes taxes"
                    checked={serviceForm.taxIncluded}
                    onChange={(e) => setServiceForm({ ...serviceForm, taxIncluded: e.target.checked })}
                  />

                  {/* Description */}
                  <div>
                    <label
                      className="block mb-2"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Service description"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-sans"
              style={{
                fontSize: "16px",
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
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {loading ? "Updating..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateService;
