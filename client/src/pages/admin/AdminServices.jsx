import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ServiceList from "../../components/admin/services/ServiceList";
import Loader from "../../components/common/Loader/loader.jsx";
import RemoveServiceModal from "../../components/modals/RemoveServiceModal";
import Select from "../../components/ui/Select.jsx";
import CategoriesTable from "../../components/admin/categories/CategoriesTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import { fetchAllCategories, fetchCategoryServices } from "../../features/admin/categories/adminCategoriesThunks";
import {
  deleteServiceThunk,
  toggleServiceAvailabilityThunk,
  toggleServiceActiveThunk,
} from "../../features/admin/services/adminServicesThunks";
import ToggleServiceAvailabilityModal from "../../components/modals/admin/ToggleServiceAvailabilityModal";
import ToggleServiceActiveModal from "../../components/modals/admin/ToggleServiceActiveModal";

/**
 * AdminServices - Admin page for managing categories and services
 * Features:
 * - Tabs: "Categories" and "Services" (all in one place under /admin/services)
 * - Categories tab: full CRUD for categories (table, search, filter, sort, pagination)
 * - Services tab: create button, update dropdowns, services list
 */
const TAB_SERVICES = "services";
const TAB_CATEGORIES = "categories";

const AdminServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === TAB_CATEGORIES ? TAB_CATEGORIES : TAB_SERVICES;

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceToggleAvailability, setServiceToggleAvailability] = useState(null);
  const [serviceToggleActive, setServiceToggleActive] = useState(null);

  // Categories tab state (search, filter, sort)
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortByState] = useState("displayOrder");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    categories,
    pagination,
    loading: categoriesLoading,
    error: categoriesError,
    selectedCategoryServices,
    servicesLoading,
  } = useSelector((state) => state.adminCategories);

  const {
    servicesByCategory,
    categoryServicesLoading,
  } = useSelector((state) => state.adminServices);

  // Fetch categories: when on Services tab use full list for dropdowns; when on Categories tab use paginated/filtered
  useEffect(() => {
    if (activeTab === TAB_SERVICES) {
      dispatch(fetchAllCategories({ limit: 100, sortBy: 'displayOrder', sortOrder: 'asc' }));
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (activeTab !== TAB_CATEGORIES) return;
    const params = {
      page: pagination.currentPage,
      limit: 20,
      search: searchInput,
      sortBy: sortBy,
      sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
    };
    if (statusFilter === "active") params.isActive = true;
    else if (statusFilter === "inactive") params.isActive = false;
    dispatch(fetchAllCategories(params));
  }, [activeTab, pagination.currentPage, searchInput, sortBy, statusFilter, dispatch]);

  // Debounce search when on Categories tab
  useEffect(() => {
    if (activeTab !== TAB_CATEGORIES) return;
    const t = setTimeout(() => {
      const params = {
        page: 1,
        limit: 20,
        search: searchInput,
        sortBy: sortBy,
        sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
      };
      if (statusFilter === "active") params.isActive = true;
      else if (statusFilter === "inactive") params.isActive = false;
      dispatch(fetchAllCategories(params));
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput, activeTab, dispatch, sortBy, statusFilter]);

  // Fetch services when category is selected (Services tab)
  useEffect(() => {
    if (selectedCategoryId && activeTab === TAB_SERVICES) {
      dispatch(fetchCategoryServices({ categoryId: selectedCategoryId }));
    }
  }, [selectedCategoryId, dispatch, activeTab]);

  const setTab = (tab) => {
    setSearchParams(tab === TAB_CATEGORIES ? { tab: TAB_CATEGORIES } : {});
  };

  const handleCategoriesPageChange = (page) => {
    const params = {
      page,
      limit: 20,
      search: searchInput,
      sortBy: sortBy,
      sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
    };
    if (statusFilter === "active") params.isActive = true;
    else if (statusFilter === "inactive") params.isActive = false;
    dispatch(fetchAllCategories(params));
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

  // Toggle availability: open modal
  const handleToggleAvailability = (service) => {
    setServiceToggleAvailability(service);
  };

  const confirmToggleAvailability = async () => {
    if (!serviceToggleAvailability) return;
    const serviceId = serviceToggleAvailability.id || serviceToggleAvailability._id;
    const serviceName = serviceToggleAvailability.name || "Service";
    try {
      await dispatch(toggleServiceAvailabilityThunk(serviceId)).unwrap();
      toast.success(
        serviceToggleAvailability.isAvailable !== false
          ? `"${serviceName}" marked as not available.`
          : `"${serviceName}" marked as available.`
      );
      setServiceToggleAvailability(null);
      if (selectedCategoryId) {
        await dispatch(fetchCategoryServices({ categoryId: selectedCategoryId }));
      }
    } catch (error) {
      toast.error(error || "Failed to update availability");
    }
  };

  const cancelToggleAvailability = () => {
    setServiceToggleAvailability(null);
  };

  // Toggle active: open modal
  const handleToggleActive = (service) => {
    setServiceToggleActive(service);
  };

  const confirmToggleActive = async () => {
    if (!serviceToggleActive) return;
    const serviceId = serviceToggleActive.id || serviceToggleActive._id;
    const serviceName = serviceToggleActive.name || "Service";
    try {
      await dispatch(toggleServiceActiveThunk(serviceId)).unwrap();
      toast.success(
        serviceToggleActive.isActive !== false
          ? `"${serviceName}" deactivated and hidden from the site.`
          : `"${serviceName}" activated and visible on the site.`
      );
      setServiceToggleActive(null);
      if (selectedCategoryId) {
        await dispatch(fetchCategoryServices({ categoryId: selectedCategoryId }));
      }
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

  const cancelToggleActive = () => {
    setServiceToggleActive(null);
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
      {/* Page Title + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1
          className="text-3xl font-bold font-sans"
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#292D32",
          }}
        >
          My Services
        </h1>
        <div className="flex items-center gap-2">
          {/* Tab: Services */}
          <button
            type="button"
            onClick={() => setTab(TAB_SERVICES)}
            className={`px-5 py-2.5 rounded-full font-sans font-semibold transition-colors ${
              activeTab === TAB_SERVICES
                ? "bg-[#CC2B52] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-[#CC2B52] hover:text-[#CC2B52]"
            }`}
            style={{ fontSize: "15px" }}
          >
            Services
          </button>
          {/* Tab: Categories */}
          <button
            type="button"
            onClick={() => setTab(TAB_CATEGORIES)}
            className={`px-5 py-2.5 rounded-full font-sans font-semibold transition-colors ${
              activeTab === TAB_CATEGORIES
                ? "bg-[#CC2B52] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-[#CC2B52] hover:text-[#CC2B52]"
            }`}
            style={{ fontSize: "15px" }}
          >
            Categories
          </button>
          {/* Create New Button - visible on both tabs */}
          <button
            onClick={handleCreateNew}
            className="ml-2 px-6 py-3 bg-[#CC2B52] text-white rounded-full hover:bg-[#CC2B52]/90 transition-colors flex items-center gap-2 font-sans"
            style={{ fontSize: "16px", fontWeight: 600 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>
      </div>

      {/* Categories Tab Content */}
      {activeTab === TAB_CATEGORIES && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: "285px", height: "38px" }}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] font-sans"
                  style={{ fontSize: "14px" }}
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                height="38px"
                showLabel={false}
                className="min-w-[150px]"
              />
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortByState(e.target.value)}
              options={[
                { value: "displayOrder", label: "Sort by: Display Order" },
                { value: "createdAt", label: "Sort by: Newest" },
                { value: "name", label: "Sort by: Name" },
              ]}
              height="38px"
              showLabel={false}
              className="min-w-[200px]"
            />
          </div>
          <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
            <span className="text-sm text-gray-600">Total Categories:</span>
            <span className="text-base font-semibold text-gray-900">{pagination.totalCategories || 0}</span>
          </div>
          {categoriesError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">Error: {categoriesError}</p>
            </div>
          )}
          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="medium" text="Loading categories..." />
            </div>
          ) : (
            <>
              <CategoriesTable categories={categories} loading={false} />
              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <AdminPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handleCategoriesPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Services Tab Content */}
      {activeTab === TAB_SERVICES && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 font-sans" style={{ fontSize: "24px", fontWeight: 700, color: "#292D32" }}>
              Update
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Category"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedServiceId("");
                }}
                options={[
                  { value: "", label: "Select Category" },
                  ...categories.map((cat) => ({
                    value: cat.id || cat._id,
                    label: cat.name || "Unnamed Category",
                  })),
                ]}
                placeholder="Select Category"
                height="44px"
              />
              <Select
                label="Select Service"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                disabled={!selectedCategoryId || servicesToDisplay.length === 0}
                options={[
                  { value: "", label: "Select Service" },
                  ...servicesToDisplay.map((s) => ({
                    value: s.id || s._id,
                    label: s.name,
                  })),
                ]}
                placeholder="Select Service"
                height="44px"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 font-sans" style={{ fontSize: "18px", fontWeight: 600, color: "#292D32" }}>
              Services
              {selectedCategoryId && <span className="text-sm font-normal text-gray-500 ml-2">({servicesToDisplay.length})</span>}
            </h3>
            {servicesLoading || categoryServicesLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
                <Loader size="small" text="Loading services..." />
              </div>
            ) : !selectedCategoryId ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-sm">Select a category to view services</p>
              </div>
            ) : (
              <ServiceList
                services={servicesToDisplay}
                onServiceEdit={handleServiceEdit}
                onServiceDelete={handleServiceDelete}
                onToggleAvailability={handleToggleAvailability}
                onToggleActive={handleToggleActive}
              />
            )}
          </div>
        </>
      )}

      {deleteModalOpen && serviceToDelete && (
        <RemoveServiceModal
          serviceName={serviceToDelete.name || "this service"}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {serviceToggleAvailability && (
        <ToggleServiceAvailabilityModal
          serviceName={serviceToggleAvailability.name || "Service"}
          isAvailable={serviceToggleAvailability.isAvailable !== false}
          onConfirm={confirmToggleAvailability}
          onCancel={cancelToggleAvailability}
        />
      )}

      {serviceToggleActive && (
        <ToggleServiceActiveModal
          serviceName={serviceToggleActive.name || "Service"}
          isActive={serviceToggleActive.isActive !== false}
          onConfirm={confirmToggleActive}
          onCancel={cancelToggleActive}
        />
      )}
    </div>
  );
};

export default AdminServices;
