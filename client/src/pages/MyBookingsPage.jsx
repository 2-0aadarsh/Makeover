import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchUserBookings,
  setFilters,
  clearFilters,
  setPagination,
  clearErrors,
  selectBookings,
  selectBookingLoading,
  selectBookingError,
  selectBookingFilters,
  selectBookingPagination,
  selectBookingStats,
  fetchBookingStats
} from '../features/booking/bookingSlice.js';
import BookingCard from '../components/booking/BookingCard.jsx';
import BookingFilters from '../components/booking/BookingFilters.jsx';
import BookingStats from '../components/booking/BookingStats.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import ReviewModal from '../components/modals/ReviewModal.jsx';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux selectors
  const bookings = useSelector(selectBookings);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);
  const filters = useSelector(selectBookingFilters);
  const pagination = useSelector(selectBookingPagination);
  const stats = useSelector(selectBookingStats);

  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      status: searchParams.get('status') || 'all',
      dateFrom: searchParams.get('dateFrom') || null,
      dateTo: searchParams.get('dateTo') || null,
      service: searchParams.get('service') || '',
      searchQuery: searchParams.get('q') || ''
    };

    const urlPagination = {
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 10
    };

    dispatch(setFilters(urlFilters));
    dispatch(setPagination(urlPagination));
    setSearchQuery(urlFilters.searchQuery);
  }, [dispatch, searchParams]);

  // Fetch bookings when filters or pagination change
  useEffect(() => {
    const fetchBookings = () => {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === 'all' || params[key] === '') {
          delete params[key];
        }
      });

      dispatch(fetchUserBookings(params));
    };

    fetchBookings();
  }, [dispatch, filters, pagination.page, pagination.limit]);

  // Fetch stats on component mount
  useEffect(() => {
    dispatch(fetchBookingStats());
  }, [dispatch]);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters, newPagination) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });

    if (newPagination.page > 1) {
      params.set('page', newPagination.page);
    }

    if (newPagination.limit !== 10) {
      params.set('limit', newPagination.limit);
    }

    setSearchParams(params);
  }, [setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    dispatch(setFilters(updatedFilters));
    dispatch(setPagination({ ...pagination, page: 1 }));
    updateURL(updatedFilters, { ...pagination, page: 1 });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleFilterChange({ searchQuery: searchQuery.trim() });
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setPagination({ ...pagination, page: 1 }));
    setSearchQuery('');
    setSearchParams({});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setPagination({ ...pagination, page: newPage }));
    updateURL(filters, { ...pagination, page: newPage });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle booking card click
  const handleBookingClick = (bookingId) => {
    navigate(`/my-bookings/${bookingId}`);
  };

  // Handle retry
  const handleRetry = () => {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit
    };

    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === 'all' || params[key] === '') {
        delete params[key];
      }
    });

    dispatch(fetchUserBookings(params));
  };

  // Handle write review
  const handleWriteReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewModalOpen(true);
  };

  // Handle review modal close
  const handleReviewModalClose = () => {
    setReviewModalOpen(false);
    setSelectedBookingForReview(null);
    // Refresh bookings to update review status
    dispatch(fetchUserBookings({
      ...filters,
      page: pagination.page,
      limit: pagination.limit
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Match the exact design */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              
              {/* Help Section - Match the design */}
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Need help with your booking? Write us at{' '}
                  <a 
                    href="mailto:hello@wemakeover.co.in" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    hello@wemakeover.co.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Hidden for clean design, but can be enabled if needed */}
        {false && stats && stats.totalBookings > 0 && (
          <div className="mb-8">
            <BookingStats stats={stats} />
          </div>
        )}

        {/* Search and Filters - Hidden for clean design, but can be enabled if needed */}
        {false && (
          <>
            <div className="mb-6">
              <form onSubmit={handleSearch} className="max-w-md">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings, services, or locations..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded-r-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {showFilters && (
              <div className="mb-6">
                <BookingFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
              retryText="Try Again"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            title="No booking details"
            description={
              filters.status !== 'all' || filters.searchQuery || filters.dateFrom || filters.dateTo
                ? "No bookings match your current filters. Try adjusting your search criteria."
                : "You haven't made any bookings yet. Book your first beauty service today!"
            }
            actionText={filters.status !== 'all' || filters.searchQuery || filters.dateFrom || filters.dateTo ? "Clear Filters" : "Book Now"}
            onAction={filters.status !== 'all' || filters.searchQuery || filters.dateFrom || filters.dateTo ? handleClearFilters : () => navigate('/services')}
          />
        )}

        {/* Bookings List - Match the exact grid layout */}
        {!loading && !error && bookings.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onClick={() => handleBookingClick(booking._id)}
                  onWriteReview={handleWriteReview}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              </div>
            )}
          </>
        )}

        {/* Quick Actions - Hidden for clean design, but can be enabled if needed */}
        {false && !loading && bookings.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book New Service
            </button>
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={handleReviewModalClose}
          booking={selectedBookingForReview}
        />
      </div>
    </div>
  );
};

export default MyBookingsPage;
