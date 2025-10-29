import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBookings,
  fetchUpcomingBookings,
  fetchBookingStats,
  selectBookings,
  selectUpcomingBookings,
  selectBookingStats,
  selectBookingLoading,
  selectBookingError
} from "../../../features/booking/bookingSlice.js";
import LoadingSpinner from "../../common/LoadingSpinner.jsx";
import ErrorMessage from "../../common/ErrorMessage.jsx";
import EmptyState from "../../common/EmptyState.jsx";

/**
 * BookingPage Component - Dynamic Version
 *
 * Displays user's bookings with real data from the API
 * Replaces all static sample data with dynamic booking system
 */
const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const bookings = useSelector(selectBookings);
  const upcomingBookings = useSelector(selectUpcomingBookings);
  const stats = useSelector(selectBookingStats);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Debug current state
  console.log('🔍 BookingPage: Current state:', { 
    bookings: bookings.length, 
    stats, 
    loading, 
    error,
    statsExists: !!stats,
    statsTotalBookings: stats?.totalBookings
  });

  // Fetch bookings data on component mount
  useEffect(() => {
    console.log('🔍 BookingPage: Fetching data...', { stats, loading, error });
    
    // Fetch all bookings
    dispatch(fetchUserBookings({ limit: 20 }));
    
    // Fetch upcoming bookings for quick access
    dispatch(fetchUpcomingBookings(5));
    
    // Fetch booking statistics
    dispatch(fetchBookingStats());
  }, [dispatch]);

  // Handle view booking details - navigate to dedicated page
  const handleViewBookingDetails = (booking) => {
    navigate(`/my-bookings/${booking._id}`);
  };

  // Handle retry on error
  const handleRetry = () => {
    dispatch(fetchUserBookings({ limit: 20 }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: 'Confirmed', className: 'bg-green-100 text-green-800' },
      in_progress: { text: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      completed: { text: 'Completed', className: 'bg-gray-100 text-gray-800' },
      cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-800' },
      no_show: { text: 'No Show', className: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: { text: 'Payment Pending', className: 'bg-yellow-100 text-yellow-800' },
      processing: { text: 'Processing', className: 'bg-blue-100 text-blue-800' },
      completed: { text: 'Paid', className: 'bg-green-100 text-green-800' },
      failed: { text: 'Payment Failed', className: 'bg-red-100 text-red-800' },
      refunded: { text: 'Refunded', className: 'bg-gray-100 text-gray-800' }
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="mt-2 text-gray-600">
                Manage your beauty service bookings
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => navigate('/my-bookings')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                View All Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats?.totalSpent || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.completedBookings || 0}</p>
              </div>
            </div>
                </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.upcomingBookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

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
            description="You haven't made any bookings yet. Book your first beauty service today!"
            actionText="Book Now"
            onAction={() => navigate('/services')}
          />
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.slice(0, 6).map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
                onClick={() => handleViewBookingDetails(booking)}
              >
        {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {booking.services?.[0]?.name || 'Service'}
                        {booking.services?.length > 1 && ` + ${booking.services.length - 1} more`}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(booking.status)}
                        {getPaymentBadge(booking.paymentStatus)}
                      </div>
        </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(booking.pricing?.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
              </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date and Time */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Date & Time</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {new Date(booking.bookingDetails?.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.bookingDetails?.slot || 'Time not specified'}
                    </p>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">Services</span>
                    </div>
                    <div className="space-y-1">
                      {booking.services?.slice(0, 2).map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {service.name}
                            {service.quantity > 1 && ` (×${service.quantity})`}
                          </span>
                          <span className="text-gray-600">
                            {formatCurrency(service.price * service.quantity)}
                          </span>
                        </div>
                      ))}
                      {booking.services?.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{booking.services.length - 2} more services
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  {booking.bookingDetails?.address && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {booking.bookingDetails.address.city}, {booking.bookingDetails.address.state}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingDetails.address.pincode}
                      </p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Click to view details
                      </span>
                      
                      <div className="flex space-x-2">
                        {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                          <span className="text-xs bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                            Pay Now
                          </span>
                        )}
                        
                        {booking.status === 'pending' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            Reschedule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* View All Button */}
        {!loading && bookings.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/my-bookings')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              View All Bookings ({bookings.length})
            </button>
          </div>
        )}

        {/* Quick Actions */}
        {!loading && bookings.length > 0 && (
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
      </div>
    </div>
  );
};

export default BookingPage;