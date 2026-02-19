import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnquiriesTable from "../../components/admin/enquiries/EnquiriesTable";
<<<<<<< HEAD
import ContactUsMessagesTable from "../../components/admin/enquiries/ContactUsMessagesTable";
=======
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
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
<<<<<<< HEAD
import { adminContactMessagesApi } from "../../features/admin/contactMessages/adminContactMessagesApi";

/**
 * AdminEnquiries - Admin page for enquiries and Contact Us messages
 * Toggle: Enquiries (service enquiries) | Contact Us messages
 */
const VIEW_ENQUIRIES = "enquiries";
const VIEW_CONTACT_US = "contactUs";

const AdminEnquiries = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortByState] = useState("newest");
  const [viewMode, setViewMode] = useState(VIEW_ENQUIRIES);

  // Contact Us messages state
  const [contactMessages, setContactMessages] = useState([]);
  const [contactPagination, setContactPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    limit: 8,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [contactSearchInput, setContactSearchInput] = useState("");
  const [contactSortBy, setContactSortByState] = useState("newest");
=======

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
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8

  const {
    enquiries,
    pagination,
    loading,
    error,
    searchQuery,
  } = useSelector((state) => state.adminEnquiries);

<<<<<<< HEAD
  // Sync search input with Redux state (enquiries)
=======
  // Sync search input with Redux state
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

<<<<<<< HEAD
  // Fetch enquiries when filters change
=======
  // Fetch data when filters change
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: 8,
      search: searchQuery,
      sortBy: sortBy === "newest" ? "createdAt" : "createdAt",
      sortOrder: sortBy === "newest" ? "desc" : "asc",
    };
<<<<<<< HEAD
    dispatch(fetchAllEnquiries(params));
  }, [pagination.currentPage, searchQuery, sortBy, dispatch]);

  // Debounced search for contact messages
  const [contactSearchDebounced, setContactSearchDebounced] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(() => setContactSearchDebounced(contactSearchInput), 500);
    return () => clearTimeout(timeoutId);
  }, [contactSearchInput]);

  // Fetch contact messages when view is Contact Us and when params change
  useEffect(() => {
    if (viewMode !== VIEW_CONTACT_US) return;
    let cancelled = false;
    setContactLoading(true);
    setContactError(null);
    const params = {
      page: contactPagination.currentPage,
      limit: 8,
      search: contactSearchDebounced.trim() || undefined,
      sortBy: "createdAt",
      sortOrder: contactSortBy === "newest" ? "desc" : "asc",
    };
    adminContactMessagesApi
      .getAll(params)
      .then((res) => {
        if (cancelled) return;
        if (res?.data?.messages) setContactMessages(res.data.messages);
        if (res?.data?.pagination) {
          setContactPagination((prev) => ({
            ...prev,
            currentPage: res.data.pagination.currentPage ?? 1,
            totalPages: res.data.pagination.totalPages ?? 1,
            totalMessages: res.data.pagination.totalMessages ?? 0,
            limit: res.data.pagination.limit ?? 8,
            hasNextPage: res.data.pagination.hasNextPage ?? false,
            hasPrevPage: res.data.pagination.hasPrevPage ?? false,
          }));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setContactError(err.message || "Failed to load contact messages");
          setContactMessages([]);
        }
      })
      .finally(() => {
        if (!cancelled) setContactLoading(false);
      });
    return () => { cancelled = true; };
  }, [viewMode, contactPagination.currentPage, contactSearchDebounced, contactSortBy]);

  // Reset to page 1 when contact search or sort changes (debounced search already applied above)
  useEffect(() => {
    if (viewMode !== VIEW_CONTACT_US) return;
    setContactPagination((prev) => (prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }));
  }, [contactSearchDebounced, contactSortBy]);

  // Handle search (enquiries)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
      dispatch(setPage(1));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, dispatch]);

  const handleSearchChange = (e) => setSearchInput(e.target.value);
  const handleContactSearchChange = (e) => setContactSearchInput(e.target.value);

=======

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
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortByState(value);
    dispatch(setSortBy(value === "newest" ? "createdAt" : "createdAt"));
    dispatch(setSortOrder(value === "newest" ? "desc" : "asc"));
    dispatch(setPage(1));
  };

<<<<<<< HEAD
  const handleContactSortChange = (e) => {
    const value = e.target.value;
    setContactSortByState(value);
    setContactPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => dispatch(setPage(page));
  const handleContactPageChange = (page) => setContactPagination((prev) => ({ ...prev, currentPage: page }));

  const isEnquiries = viewMode === VIEW_ENQUIRIES;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1
          className="text-3xl font-bold font-sans"
          style={{ fontSize: "30px", fontWeight: 700, color: "#CC2B52" }}
        >
          Enquiries
        </h1>
        {/* Toggle: Enquiries | Contact Us messages */}
        <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-100">
          <button
            type="button"
            onClick={() => setViewMode(VIEW_ENQUIRIES)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isEnquiries
                ? "bg-white text-[#CC2B52] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Enquiries
          </button>
          <button
            type="button"
            onClick={() => setViewMode(VIEW_CONTACT_US)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isEnquiries
                ? "bg-white text-[#CC2B52] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Contact Us messages
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-end gap-4 mb-6">
          <div className="relative" style={{ width: "285px", height: "38px" }}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
=======
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
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
<<<<<<< HEAD
              value={isEnquiries ? searchInput : contactSearchInput}
              onChange={isEnquiries ? handleSearchChange : handleContactSearchChange}
              className="w-full h-full pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans"
              style={{ backgroundColor: "#F9FBFF", fontSize: "16px", fontWeight: 400 }}
            />
          </div>
          <div style={{ width: "150px" }}>
            <Select
              value={isEnquiries ? sortBy : contactSortBy}
              onChange={isEnquiries ? handleSortChange : handleContactSortChange}
=======
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
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
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

<<<<<<< HEAD
        {isEnquiries ? (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader size="medium" useCustomGif text="Loading enquiries..." />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {error}</p>
              </div>
            ) : (
              <>
                <EnquiriesTable enquiries={enquiries} />
                <AdminPagination pagination={pagination} onPageChange={handlePageChange} />
              </>
            )}
          </>
        ) : (
          <>
            {contactLoading ? (
              <div className="flex justify-center py-12">
                <Loader size="medium" useCustomGif text="Loading contact us messages..." />
              </div>
            ) : contactError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {contactError}</p>
              </div>
            ) : (
              <>
                <ContactUsMessagesTable messages={contactMessages} />
                <AdminPagination
                  pagination={contactPagination}
                  onPageChange={handleContactPageChange}
                />
              </>
            )}
=======
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
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
          </>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
