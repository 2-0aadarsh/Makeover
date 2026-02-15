import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories } from "../../features/admin/categories/adminCategoriesThunks";
import { adminCategoriesApi } from "../../features/admin/categories/adminCategoriesApi";
import { adminServicesApi } from "../../features/admin/services/adminServicesApi";
import Select from "../../components/ui/Select.jsx";
import Checkbox from "../../components/ui/Checkbox.jsx";

/**
 * CreateCategoryService - Page for creating categories and services
 * Features:
 * - Two tabs: "Create New Category" and "Create New Service"
 * - Form validation
 * - Image upload
 * - API integration
 */
const CreateCategoryService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("category"); // "category" or "service"
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    displayOrder: "",
    image: null,
    imagePreview: null,
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    bodyContent: "",
    price: "",
    duration: "",
    taxIncluded: true,
    ctaContent: "Add",
    serviceType: "Standard",
    cardType: "Vertical",
    images: [],
    imagePreviews: [],
    options: [], // e.g. [{ label: "Both Hands", priceDisplay: "499" }, { label: "Both Hands & Legs", priceDisplay: "2.5k-11k" }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const serviceImageInputRef = useRef(null);
  const { categories } = useSelector((state) => state.adminCategories);

  // Fetch categories when service tab is active
  useEffect(() => {
    if (activeTab === "service") {
      dispatch(fetchAllCategories({ limit: 100 }));
    }
  }, [activeTab, dispatch]);

  // Handle category image upload
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryForm({
        ...categoryForm,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

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

  // Remove service image
  const removeServiceImage = (index) => {
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(serviceForm.imagePreviews[index]);
    setServiceForm({
      ...serviceForm,
      images: serviceForm.images.filter((_, i) => i !== index),
      imagePreviews: serviceForm.imagePreviews.filter((_, i) => i !== index),
    });
  };

  // Handle category form submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!categoryForm.name) {
        throw new Error("Category name is required");
      }
      if (!categoryForm.image) {
        throw new Error("Category image is required");
      }

      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("description", categoryForm.description || "");
      formData.append("displayOrder", categoryForm.displayOrder || "0");
      formData.append("image", categoryForm.image);

      const response = await adminCategoriesApi.createCategory(formData);
      
      if (response.success) {
        // Clean up preview URL
        if (categoryForm.imagePreview) {
          URL.revokeObjectURL(categoryForm.imagePreview);
        }
        // Reset form
        setCategoryForm({
          name: "",
          description: "",
          displayOrder: "",
          image: null,
          imagePreview: null,
        });
        // Refresh categories list
        dispatch(fetchAllCategories({ limit: 100 }));
        setSuccessMessage("Category created successfully!");
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        throw new Error(response.message || "Failed to create category");
      }
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Handle service form submission
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
      const hasOptions = serviceForm.options && serviceForm.options.length > 0 && serviceForm.options.some(o => o && o.label && String(o.label).trim());
      // Price required when CTA is "Add" and no options; if options provided, first option drives price
      if (serviceForm.ctaContent === "Add" && !hasOptions && (!serviceForm.price || !String(serviceForm.price).trim())) {
        throw new Error("Service price is required when CTA Content is Add (or add at least one option with label)");
      }
      if (serviceForm.images.length === 0) {
        throw new Error("At least one service image is required");
      }

      const formData = new FormData();
      formData.append("categoryId", serviceForm.categoryId);
      formData.append("name", serviceForm.name.trim());
      // Use description if provided, otherwise use bodyContent as fallback
      const descriptionValue = (serviceForm.description && serviceForm.description.trim()) 
        ? serviceForm.description.trim() 
        : (serviceForm.bodyContent && serviceForm.bodyContent.trim() 
          ? serviceForm.bodyContent.trim() 
          : "");
      formData.append("description", descriptionValue);
      formData.append("bodyContent", serviceForm.bodyContent || "");
      // Send price as-is (range e.g. "2.5k-4k", number, or empty for "Get in touch for pricing")
      formData.append("price", serviceForm.price != null ? String(serviceForm.price).trim() : "");
      formData.append("duration", serviceForm.duration || "");
      formData.append("taxIncluded", serviceForm.taxIncluded ? "true" : "false");
      formData.append("ctaContent", serviceForm.ctaContent);
      // Only include serviceType if CTA Content is "Add"
      if (serviceForm.ctaContent === "Add") {
        formData.append("serviceType", serviceForm.serviceType || "Standard");
      }
      formData.append("cardType", serviceForm.cardType);
      if (serviceForm.options && serviceForm.options.length > 0) {
        const validOptions = serviceForm.options
          .filter(o => o && o.label && String(o.label).trim())
          .map(o => ({ label: String(o.label).trim(), price: o.price ?? "", priceDisplay: o.priceDisplay ?? String(o.price ?? "").trim() }));
        if (validOptions.length > 0) {
          formData.append("options", JSON.stringify(validOptions));
        }
      }

      // Append all images
      serviceForm.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await adminServicesApi.createService(formData);
      
      if (response.success) {
        // Clean up preview URLs
        serviceForm.imagePreviews.forEach(preview => {
          URL.revokeObjectURL(preview);
        });
        // Reset form
        setServiceForm({
          categoryId: "",
          name: "",
          description: "",
          bodyContent: "",
          price: "",
          duration: "",
          taxIncluded: true,
          ctaContent: "Add",
          serviceType: "Standard",
          cardType: "Vertical",
          images: [],
          imagePreviews: [],
          options: [],
        });
        if (serviceImageInputRef.current) {
          serviceImageInputRef.current.value = "";
        }
        // Refresh categories to get updated service counts
        dispatch(fetchAllCategories({ limit: 100 }));
        setSuccessMessage("Service created successfully!");
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        throw new Error(response.message || "Failed to create service");
      }
    } catch (err) {
      setError(err.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

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
        New Category/Service Creation
      </h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("category");
              setError(null);
              setSuccessMessage(null);
            }}
            className="pb-4 relative font-sans"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: activeTab === "category" ? "#CC2B52" : "#292D32",
            }}
          >
            Create New Category
            {activeTab === "category" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("service");
              setError(null);
              setSuccessMessage(null);
            }}
            className="pb-4 relative font-sans"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: activeTab === "service" ? "#CC2B52" : "#292D32",
            }}
          >
            Create New Service
            {activeTab === "service" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]" />
            )}
          </button>
        </div>
      </div>

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

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Create New Category Tab */}
        {activeTab === "category" && (
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-6">
              {/* Category Details Section */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4 font-sans"
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#292D32",
                  }}
                >
                  Category Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Name */}
                  <div>
                    <label
                      className="block mb-2 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Category Name Here"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                      required
                    />
                  </div>

                  {/* Upload Image */}
                  <div>
                    <label
                      className="block mb-2 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Upload Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#CC2B52] file:text-white hover:file:bg-[#CC2B52]/90"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#292D32",
                        }}
                        required
                      />
                      {categoryForm.imagePreview && (
                        <div className="mt-2">
                          <img
                            src={categoryForm.imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      className="block mb-2 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Category description"
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <label
                      className="block mb-2 font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#292D32",
                      }}
                    >
                      Display Order (Optional)
                    </label>
                    <input
                      type="number"
                      value={categoryForm.displayOrder}
                      onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#292D32",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
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
                  {loading ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Create New Service Tab */}
        {activeTab === "service" && (
          <form onSubmit={handleServiceSubmit}>
            <div className="space-y-6">
              {/* Select Category */}
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

              {/* Add Service Section */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4 font-sans"
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#292D32",
                  }}
                >
                  Add Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Upload Image */}
                    <div>
                      <label
                        className="block mb-2"
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#292D32",
                        }}
                      >
                        Upload Image
                      </label>
                      <input
                        ref={serviceImageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleServiceImagesChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#CC2B52] file:text-white hover:file:bg-[#CC2B52]/90"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#292D32",
                        }}
                        required
                      />
                      {serviceForm.imagePreviews.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {serviceForm.imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeServiceImage(index)}
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

                    {/* CTA Content */}
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

                  {/* Right Column */}
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

                    {/* Price (optional when options are set) */}
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
                        placeholder="12K, 2.5k-11k, or leave empty for Enquire Now"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#292D32",
                        }}
                        required={serviceForm.ctaContent === "Add" && (!serviceForm.options || serviceForm.options.length === 0)}
                      />
                      <p className="mt-1 text-xs text-gray-500">Or add options below (e.g. Both Hands, Both Hands & Legs) with per-option price.</p>
                    </div>

                    {/* Service options (variants) */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className="block"
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#292D32",
                          }}
                        >
                          Service options (e.g. Both Hands, Both Hands & Legs)
                        </label>
                        <button
                          type="button"
                          onClick={() => setServiceForm({ ...serviceForm, options: [...(serviceForm.options || []), { label: "", priceDisplay: "" }] })}
                          className="px-3 py-1.5 text-sm bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90"
                        >
                          + Add option
                        </button>
                      </div>
                      {(serviceForm.options || []).map((opt, idx) => (
                        <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center">
                          <input
                            type="text"
                            value={opt.label || ""}
                            onChange={(e) => {
                              const next = [...(serviceForm.options || [])];
                              next[idx] = { ...next[idx], label: e.target.value };
                              setServiceForm({ ...serviceForm, options: next });
                            }}
                            placeholder="Option label (e.g. Both Hands & Legs)"
                            className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#CC2B52] text-sm"
                          />
                          <input
                            type="text"
                            value={opt.priceDisplay ?? opt.price ?? ""}
                            onChange={(e) => {
                              const next = [...(serviceForm.options || [])];
                              next[idx] = { ...next[idx], priceDisplay: e.target.value, price: e.target.value };
                              setServiceForm({ ...serviceForm, options: next });
                            }}
                            placeholder="Price (e.g. 499 or 2.5k-11k)"
                            className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#CC2B52] text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setServiceForm({ ...serviceForm, options: serviceForm.options.filter((_, i) => i !== idx) })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            aria-label="Remove option"
                          >
                            ×
                          </button>
                        </div>
                      ))}
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

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/services")}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                  {loading ? "Creating..." : "Create Service"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCategoryService;
