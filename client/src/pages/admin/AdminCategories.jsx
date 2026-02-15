import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../components/admin/categories/CategoriesTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { fetchAllCategories } from "../../features/admin/categories/adminCategoriesThunks";

/**
 * AdminCategories - Admin page for managing categories
 * Features:
 * - Search functionality
 * - Sort dropdown
 * - Filter by active/inactive
 * - Pagination
 * - Create, Edit, Delete operations
 */
const AdminCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortByState] = useState("displayOrder");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"

  const {
    categories,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.adminCategories);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: 20,
      search: searchInput,
      sortBy: sortBy,
      sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
    };

    // Add active filter if not "all"
    if (statusFilter === "active") {
      params.isActive = true;
    } else if (statusFilter === "inactive") {
      params.isActive = false;
    }

    dispatch(fetchAllCategories(params));
  }, [pagination.currentPage, searchInput, sortBy, statusFilter, dispatch]);

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trigger fetch with updated search
      const params = {
        page: 1, // Reset to first page on search
        limit: 20,
        search: searchInput,
        sortBy: sortBy,
        sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
      };

      if (statusFilter === "active") {
        params.isActive = true;
      } else if (statusFilter === "inactive") {
        params.isActive = false;
      }

      dispatch(fetchAllCategories(params));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch, sortBy, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortByState(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
  };

  // Handle create new category
  const handleCreateNew = () => {
    navigate("/admin/services/create");
  };

  // Handle page change
  const handlePageChange = (page) => {
    const params = {
      page: page,
      limit: 20,
      search: searchInput,
      sortBy: sortBy,
      sortOrder: sortBy === "displayOrder" ? "asc" : "desc",
    };

    if (statusFilter === "active") {
      params.isActive = true;
    } else if (statusFilter === "inactive") {
      params.isActive = false;
    }

    dispatch(fetchAllCategories(params));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold font-sans"
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#292D32",
          }}
        >
          Categories
        </h1>
        
        {/* Create New Button */}
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-[#CC2B52] text-white rounded-full hover:bg-[#CC2B52]/90 transition-colors flex items-center gap-2 font-sans"
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
          Create New Category
        </button>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search, Filter, and Sort Controls */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* Left side - Search and Status Filter */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative" style={{ width: "285px", height: "38px" }}>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full h-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
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

          {/* Right side - Sort */}
          <Select
            value={sortBy}
            onChange={handleSortChange}
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

        {/* Stats Summary */}
        <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
          <div>
            <span className="text-sm text-gray-600 font-sans">Total Categories:</span>
            <span className="ml-2 text-base font-semibold text-gray-900">{pagination.totalCategories || 0}</span>
          </div>
          {searchInput && (
            <div>
              <span className="text-sm text-gray-600 font-sans">Showing:</span>
              <span className="ml-2 text-base font-semibold text-gray-900">{categories.length} results</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="medium" text="Loading categories..." />
          </div>
        ) : (
          <>
            {/* Categories Table */}
            <CategoriesTable categories={categories} loading={loading} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <AdminPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
