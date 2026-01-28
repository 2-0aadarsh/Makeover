import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CategoryList from "../../components/admin/services/CategoryList";
import ServiceList from "../../components/admin/services/ServiceList";
import Loader from "../../components/common/Loader/loader.jsx";
import RemoveServiceModal from "../../components/modals/RemoveServiceModal";
import { fetchAllCategories, fetchCategoryServices } from "../../features/admin/categories/adminCategoriesThunks";
import { fetchServicesByCategory, deleteServiceThunk } from "../../features/admin/services/adminServicesThunks";

/**
 * AdminServices - Admin page for managing categories and services
 * Features:
 * - Create new category/service button
 * - Update section with category and service dropdowns
 * - Lists showing categories and services
 * - Matches Figma design specifications
 */
const AdminServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    selectedCategoryServices,
    servicesLoading,
  } = useSelector((state) => state.adminCategories);

  const {
    servicesByCategory,
    categoryServicesLoading,
  } = useSelector((state) => state.adminServices);

  // Fetch all categories on mount
  useEffect(() => {
    dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }));
  }, [dispatch]);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('Categories state:', {
      count: categories.length,
      loading: categoriesLoading,
      error: categoriesError,
      categories: categories,
    });
    if (categories.length > 0) {
      console.log('✅ Categories loaded:', categories);
    }
    if (categoriesError) {
      console.error('❌ Categories error:', categoriesError);
    }
    if (!categoriesLoading && categories.length === 0 && !categoriesError) {
      console.warn('⚠️ No categories found - check if API call succeeded');
    }
  }, [categories, categoriesLoading, categoriesError]);

  // Fetch services when category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchCategoryServices({ categoryId: selectedCategoryId }));
    }
  }, [selectedCategoryId, dispatch]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    const categoryId = category.id || category._id;
    setSelectedCategoryId(categoryId);
    setSelectedServiceId(""); // Reset service selection
  };

  // Handle service edit
  const handleServiceEdit = (service) => {
    const serviceId = service.id || service._id;
    navigate(`/admin/services/update/${serviceId}`);
  };

  // Handle service delete
  const handleServiceDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (serviceToDelete) {
      const serviceId = serviceToDelete.id || serviceToDelete._id;
      const serviceName = serviceToDelete.name || 'service';
      
      try {
        await dispatch(deleteServiceThunk(serviceId)).unwrap();
        
        // Show success message
        toast.success(`"${serviceName}" deleted successfully`);
        
        // Refresh services list after successful deletion
        if (selectedCategoryId) {
          await dispatch(fetchCategoryServices({ categoryId: selectedCategoryId }));
        }
        
        // Reset service selection if the deleted service was selected
        if (selectedServiceId === serviceId) {
          setSelectedServiceId("");
        }
        
        // Close modal and reset state
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      } catch (error) {
        console.error("Failed to delete service:", error);
        toast.error(error || "Failed to delete service. Please try again.");
        // Keep modal open on error so user can try again or cancel
      }
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  // Handle create new button click
  const handleCreateNew = () => {
    navigate("/admin/services/create");
  };

  // Get services to display
  // If a service is selected, show only that service; otherwise show all services from the category
  const servicesToDisplay = selectedCategoryId 
    ? (selectedServiceId 
        ? selectedCategoryServices.filter(service => (service.id || service._id) === selectedServiceId)
        : selectedCategoryServices)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title */}
      <h1
        className="text-3xl font-bold mb-8 font-sans"
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#292D32",
        }}
      >
        Services
      </h1>

      {/* Create New Button */}
      <button
        onClick={handleCreateNew}
        className="mb-8 px-6 py-3 bg-[#CC2B52] text-white rounded-full hover:bg-[#CC2B52]/90 transition-colors flex items-center gap-2 font-sans"
        style={{
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Category/Service
      </button>

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

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Category Dropdown */}
          <div>
            <label
              className="block mb-2 font-sans"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#292D32",
              }}
            >
              Select Category
            </label>
            <div className="relative">
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedServiceId("");
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent appearance-none bg-white font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#292D32",
                  height: "44px",
                }}
              >
                <option value="">Select Category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option
                      key={category.id || category._id}
                      value={category.id || category._id}
                    >
                      {category.name || 'Unnamed Category'}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="#CC2B52"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Select Service Dropdown */}
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
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                disabled={!selectedCategoryId || servicesToDisplay.length === 0}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed font-sans"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#292D32",
                  height: "44px",
                }}
              >
                <option value="">Select Service</option>
                {servicesToDisplay.map((service) => (
                  <option
                    key={service.id || service._id}
                    value={service.id || service._id}
                  >
                    {service.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="#CC2B52"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories List */}
        {/* <div>
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              fontFamily: "Poppins",
              fontSize: "18px",
              fontWeight: 600,
              color: "#292D32",
            }}
          >
            Categories
          </h3>
          {categoriesLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
              <Loader size="small" text="Loading categories..." />
            </div>
          ) : categoriesError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">Error: {categoriesError}</p>
              <button
                onClick={() => dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }))}
                className="mt-2 text-sm text-red-600 underline"
              >
                Retry
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-sm">No categories found</p>
            </div>
          ) : (
            <CategoryList
              categories={categories}
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategoryId}
            />
          )}
        </div> */}

        {/* Services List */}
        <div>
          <h3
            className="text-lg font-semibold mb-4 font-sans"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#292D32",
            }}
          >
            Services
            {selectedCategoryId && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({servicesToDisplay.length})
              </span>
            )}
          </h3>
          {servicesLoading || categoryServicesLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
              <Loader size="small" text="Loading services..." />
            </div>
          ) : !selectedCategoryId ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-sm">
                Select a category to view services
              </p>
            </div>
          ) : (
            <ServiceList
              services={servicesToDisplay}
              onServiceEdit={handleServiceEdit}
              onServiceDelete={handleServiceDelete}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && serviceToDelete && (
        <RemoveServiceModal
          serviceName={serviceToDelete.name || 'this service'}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AdminServices;
