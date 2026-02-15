import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsTable from "../../components/admin/reviews/ReviewsTable";
import AdminPagination from "../../components/admin/common/AdminPagination";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import ReviewDetailModal from "../../components/admin/reviews/ReviewDetailModal.jsx";
import { fetchAllReviews, updateReviewStatus } from "../../features/admin/reviews/adminReviewsThunks";
import {
  setSearchQuery,
  setRatingFilter,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  setPage,
  resetFilters,
} from "../../features/admin/reviews/adminReviewsSlice";

/**
 * AdminReviews - Admin page for managing reviews and complaints
 * Features:
 * - Search functionality
 * - Type filter (reviews/complaints)
 * - Rating filter
 * - Status filter
 * - Sort dropdown
 * - Response modal for complaints
 * - Pagination
 */
const AdminReviews = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [localSortBy, setLocalSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [localRatingFilter, setLocalRatingFilter] = useState("all");
  const [localStatusFilter, setLocalStatusFilter] = useState("all");
  
  // Modal state
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reviews,
    pagination,
    filters: statsFilters,
    loading,
    error,
    searchQuery,
    ratingFilter,
    statusFilter,
  } = useSelector((state) => state.adminReviews);

  // Sync search input with Redux state
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Sync local filters with Redux state
  useEffect(() => {
    setLocalRatingFilter(ratingFilter || "all");
    setLocalStatusFilter(statusFilter || "all");
  }, [ratingFilter, statusFilter]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: 8,
      search: searchQuery,
      sortBy: localSortBy === "newest" ? "createdAt" : "createdAt",
      sortOrder: localSortBy === "newest" ? "desc" : "asc",
      ...(typeFilter !== "all" && { type: typeFilter }),
      ...(ratingFilter && ratingFilter !== "all" && { rating: ratingFilter }),
      ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
    };

    dispatch(fetchAllReviews(params));
  }, [pagination.currentPage, searchQuery, localSortBy, typeFilter, ratingFilter, statusFilter, dispatch]);

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
    setLocalSortBy(value);
    dispatch(setSortBy(value === "newest" ? "createdAt" : "createdAt"));
    dispatch(setSortOrder(value === "newest" ? "desc" : "asc"));
    dispatch(setPage(1));
  };

  // Handle type filter change
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    dispatch(setPage(1));
  };

  // Handle rating filter change
  const handleRatingFilterChange = (e) => {
    const value = e.target.value;
    setLocalRatingFilter(value);
    dispatch(setRatingFilter(value === "all" ? "" : value));
    dispatch(setPage(1));
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setLocalStatusFilter(value);
    dispatch(setStatusFilter(value === "all" ? "" : value));
    dispatch(setPage(1));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchInput("");
    setTypeFilter("all");
    setLocalRatingFilter("all");
    setLocalStatusFilter("all");
    setLocalSortBy("newest");
    dispatch(resetFilters());
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  // Handle review click (open modal)
  const handleReviewClick = useCallback((review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Handle respond to complaint
  const handleRespondToComplaint = async (reviewId, response, newStatus) => {
    try {
      await dispatch(updateReviewStatus({ 
        reviewId, 
        status: newStatus, 
        adminResponse: response 
      })).unwrap();
      
      // Refresh the list
      dispatch(fetchAllReviews({
        page: pagination.currentPage,
        limit: 8,
        search: searchQuery,
      }));
      
      handleModalClose();
    } catch (error) {
      console.error("Failed to respond to complaint:", error);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = searchInput || typeFilter !== "all" || localRatingFilter !== "all" || localStatusFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      {/* Page Title */}
      <h1
        className="text-3xl font-bold mb-6 font-sans"
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "#CC2B52",
        }}
      >
        Reviews & Complaints
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{statsFilters?.totalReviews || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
          <p className="text-sm text-gray-500 mb-1">Positive (4-5★)</p>
          <p className="text-2xl font-bold text-green-600">{statsFilters?.positive || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
          <p className="text-sm text-gray-500 mb-1">Negative (1-2★)</p>
          <p className="text-2xl font-bold text-red-600">{statsFilters?.negative || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{statsFilters?.pending || 0}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filter Controls Row 1 - Type Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
          {[
            { value: "all", label: "All" },
            { value: "review", label: "Reviews" },
            { value: "complaint", label: "Complaints" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setTypeFilter(tab.value);
                dispatch(setPage(1));
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                typeFilter === tab.value
                  ? "bg-[#CC2B52] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Controls Row 2 - Search and Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
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
              placeholder="Search by name or order..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full h-[38px] pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent font-sans text-sm"
              style={{ backgroundColor: "#F9FBFF" }}
            />
          </div>

          {/* Rating Filter */}
          <div style={{ width: "140px" }}>
            <Select
              value={localRatingFilter}
              onChange={handleRatingFilterChange}
              options={[
                { value: "all", label: "All Ratings" },
                { value: "5", label: "5 Stars" },
                { value: "4", label: "4+ Stars" },
                { value: "3", label: "3+ Stars" },
                { value: "2", label: "2 Stars & below" },
              ]}
              placeholder="Rating"
              height="38px"
              showLabel={false}
            />
          </div>

          {/* Status Filter */}
          <div style={{ width: "140px" }}>
            <Select
              value={localStatusFilter}
              onChange={handleStatusFilterChange}
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "reviewed", label: "Reviewed" },
                { value: "published", label: "Published" },
                { value: "hidden", label: "Hidden" },
              ]}
              placeholder="Status"
              height="38px"
              showLabel={false}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ width: "150px" }}>
            <Select
              value={localSortBy}
              onChange={handleSortChange}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ]}
              placeholder="Sort by"
              height="38px"
              showLabel={false}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-[#CC2B52] font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="medium" useCustomGif text="Loading reviews..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-sans" style={{ fontSize: "15px" }}>Error: {error}</p>
          </div>
        ) : (
          <>
            <ReviewsTable 
              reviews={reviews} 
              onReviewClick={handleReviewClick}
            />

            {/* Pagination */}
            <AdminPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        review={selectedReview}
        onRespond={handleRespondToComplaint}
      />
    </div>
  );
};

export default AdminReviews;
