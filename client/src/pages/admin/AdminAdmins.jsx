import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminsTable from "../../components/admin/admins/AdminsTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import Loader from "../../components/common/Loader/loader.jsx";
import { fetchAllAdmins, fetchAdminStats } from "../../features/admin/admins/adminAdminsThunks";
import {
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  setPage,
} from "../../features/admin/admins/adminAdminsSlice";

/**
 * AdminAdmins - Admin page for managing other admins
 * Features:
 * - Search functionality
 * - Status filter (All/Active/Inactive)
 * - Sort dropdown
 * - Pagination
 * - Create new admin button
 * - Stats cards
 */
const AdminAdmins = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortByState] = useState("newest"); // "newest" or "oldest"

  const {
    admins,
    pagination,
    loading,
    error,
    stats,
    searchQuery,
    statusFilter,
  } = useSelector((state) => state.adminAdmins);

  // Sync search input with Redux state
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch stats on mount
  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
      sortBy: sortBy === "newest" ? "createdAt" : "createdAt",
      sortOrder: sortBy === "newest" ? "desc" : "asc",
    };

    dispatch(fetchAllAdmins(params));
  }, [pagination.currentPage, searchQuery, statusFilter, sortBy, dispatch]);

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

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    dispatch(setStatusFilter(e.target.value));
    dispatch(setPage(1));
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

  // Handle create new admin
  const handleCreateNew = () => {
    navigate("/admin/admins/create");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title and Create Button */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold font-sans"
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#CC2B52",
          }}
        >
          Admin Management
        </h1>
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
          Create New Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-sans mb-1">Total Admins</p>
          <p className="text-2xl font-bold text-[#CC2B52] font-sans">{stats.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-sans mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 font-sans">{stats.active || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-sans mb-1">Inactive</p>
          <p className="text-2xl font-bold text-red-600 font-sans">{stats.inactive || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-sans mb-1">Verified</p>
          <p className="text-2xl font-bold text-blue-600 font-sans">{stats.verified || 0}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search, Filter, and Sort Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          {/* Left: Search and Status Filter */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative" style={{ width: "285px", height: "38px" }}>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search by name or email..."
                className="w-full h-full px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
                style={{ fontSize: "14px" }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
            </div>

            {/* Status Filter */}
            <div className="relative" style={{ width: "150px", height: "38px" }}>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full h-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent appearance-none bg-white font-sans"
                style={{ fontSize: "14px" }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Sort */}
          <div className="relative" style={{ width: "150px", height: "38px" }}>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full h-full px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent appearance-none bg-white font-sans"
              style={{ fontSize: "14px" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="large" useCustomGif text="Loading admins..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>
              Error: {error}
            </p>
          </div>
        ) : (
          <>
            <AdminsTable admins={admins} />
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <AdminPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalAdmins}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAdmins;
