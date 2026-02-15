import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingsTable from "../../components/admin/bookings/BookingsTable";
import CustomersTable from "../../components/admin/customers/CustomersTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { fetchAllBookings } from "../../features/admin/bookings/adminBookingsThunks";
import {
  setSearchQuery as setBookingsSearch,
  setStatusFilter,
  setSortBy as setBookingsSortBy,
  setSortOrder as setBookingsSortOrder,
  setPage as setBookingsPage,
} from "../../features/admin/bookings/adminBookingsSlice";
import { fetchAllCustomers } from "../../features/admin/customers/adminCustomersThunks";
import {
  setSearchQuery as setCustomersSearch,
  setSortBy as setCustomersSortBy,
  setSortOrder as setCustomersSortOrder,
  setPage as setCustomersPage,
} from "../../features/admin/customers/adminCustomersSlice";

/**
 * BookingsAndCustomers - Admin page for managing bookings and customers
 * Features:
 * - Tabs to switch between "All Bookings" and "All Customers"
 * - Search functionality
 * - Sort dropdown
 * - Pagination
 * - Matches Figma design specifications
 */
const BookingsAndCustomers = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "customers"
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest" or "oldest"

  // Bookings state
  const {
    bookings,
    pagination: bookingsPagination,
    loading: bookingsLoading,
    error: bookingsError,
    searchQuery: bookingsSearchQuery,
    statusFilter,
  } = useSelector((state) => state.adminBookings);

  // Customers state
  const {
    customers,
    pagination: customersPagination,
    loading: customersLoading,
    error: customersError,
    searchQuery: customersSearchQuery,
  } = useSelector((state) => state.adminCustomers);

  // Sync search input with Redux state
  useEffect(() => {
    if (activeTab === "bookings") {
      setSearchInput(bookingsSearchQuery);
    } else {
      setSearchInput(customersSearchQuery);
    }
  }, [activeTab, bookingsSearchQuery, customersSearchQuery]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: activeTab === "bookings" ? bookingsPagination.currentPage : customersPagination.currentPage,
      limit: 8,
      search: activeTab === "bookings" ? bookingsSearchQuery : customersSearchQuery,
      sortBy: sortBy === "newest" ? "createdAt" : "createdAt",
      sortOrder: sortBy === "newest" ? "desc" : "asc",
    };

    if (activeTab === "bookings") {
      if (statusFilter) params.status = statusFilter;
      dispatch(fetchAllBookings(params));
    } else {
      dispatch(fetchAllCustomers(params));
    }
  }, [
    activeTab,
    bookingsPagination.currentPage,
    customersPagination.currentPage,
    bookingsSearchQuery,
    customersSearchQuery,
    statusFilter,
    sortBy,
    dispatch,
  ]);

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === "bookings") {
        dispatch(setBookingsSearch(searchInput));
        dispatch(setBookingsPage(1)); // Reset to first page
      } else {
        dispatch(setCustomersSearch(searchInput));
        dispatch(setCustomersPage(1)); // Reset to first page
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, activeTab, dispatch]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (activeTab === "bookings") {
      dispatch(setBookingsSortBy(value === "newest" ? "createdAt" : "createdAt"));
      dispatch(setBookingsSortOrder(value === "newest" ? "desc" : "asc"));
      dispatch(setBookingsPage(1));
    } else {
      dispatch(setCustomersSortBy(value === "newest" ? "createdAt" : "createdAt"));
      dispatch(setCustomersSortOrder(value === "newest" ? "desc" : "asc"));
      dispatch(setCustomersPage(1));
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchInput("");
    if (tab === "bookings") {
      dispatch(setBookingsSearch(""));
      dispatch(setBookingsPage(1));
    } else {
      dispatch(setCustomersSearch(""));
      dispatch(setCustomersPage(1));
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (activeTab === "bookings") {
      dispatch(setBookingsPage(page));
    } else {
      dispatch(setCustomersPage(page));
    }
  };

  const isLoading = activeTab === "bookings" ? bookingsLoading : customersLoading;
  const error = activeTab === "bookings" ? bookingsError : customersError;
  const pagination = activeTab === "bookings" ? bookingsPagination : customersPagination;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      <div className="bg-white rounded-lg shadow-sm  p-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange("bookings")}
              className={`pb-2 transition-all font-sans ${
                activeTab === "bookings"
                  ? "text-[#CC2B52] border-b-2 border-[#CC2B52]"
                  : "text-gray-600"
              }`}
              style={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "-1%",
              }}
            >
              All Bookings
            </button>
            <button
              onClick={() => handleTabChange("customers")}
              className={`pb-2 transition-all font-sans ${
                activeTab === "customers"
                  ? "text-[#CC2B52] border-b-2 border-[#CC2B52]"
                  : "text-gray-600"
              }`}
              style={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "-1%",
              }}
            >
              All Customers
            </button>
          </div>

          {/* Search and Sort */}
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
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="medium" useCustomGif text="Loading..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {error}</p>
          </div>
        ) : (
          <>
            {activeTab === "bookings" ? (
              <BookingsTable bookings={bookings} />
            ) : (
              <CustomersTable customers={customers} />
            )}

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

export default BookingsAndCustomers;
