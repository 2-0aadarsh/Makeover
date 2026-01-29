import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnquiriesTable from "../../components/admin/enquiries/EnquiriesTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { fetchAllEnquiries } from "../../features/admin/enquiries/adminEnquiriesThunks";
import {
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setPage,
} from "../../features/admin/enquiries/adminEnquiriesSlice";

/**
 * AdminEnquiries - Admin page for managing customer enquiries
 * Features:
 * - Search functionality
 * - Sort dropdown
 * - Pagination
 * - Matches Figma design specifications
 */
const AdminEnquiries = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortByState] = useState("newest"); // "newest" or "oldest"

  const {
    enquiries,
    pagination,
    loading,
    error,
    searchQuery,
  } = useSelector((state) => state.adminEnquiries);

  // Sync search input with Redux state
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: 8,
      search: searchQuery,
      sortBy: sortBy === "newest" ? "createdAt" : "createdAt",
      sortOrder: sortBy === "newest" ? "desc" : "asc",
    };

    dispatch(fetchAllEnquiries(params));
  }, [pagination.currentPage, searchQuery, sortBy, dispatch]);

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
      dispatch(setPage(1)); // Reset to first page
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortByState(value);
    dispatch(setSortBy(value === "newest" ? "createdAt" : "createdAt"));
    dispatch(setSortOrder(value === "newest" ? "desc" : "asc"));
    dispatch(setPage(1));
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setPage(page));
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
        Enquiries
      </h1>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search and Sort Controls */}
        <div className="flex items-center justify-end gap-4 mb-6">
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
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full h-full pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
              style={{
                backgroundColor: "#F9FBFF",
                fontSize: "16px",
                fontWeight: 400,
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ width: "150px" }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              options={[
                { value: "newest", label: "Sort by: Newest" },
                { value: "oldest", label: "Sort by: Oldest" },
              ]}
              placeholder="Sort by"
              height="38px"
              showLabel={false}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="medium" useCustomGif text="Loading enquiries..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {error}</p>
          </div>
        ) : (
          <>
            <EnquiriesTable enquiries={enquiries} />

            {/* Pagination */}
            <AdminPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
