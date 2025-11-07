import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBookings,
  fetchUpcomingBookings,
  fetchBookingStats,
  selectBookings,
  selectBookingStats,
  selectBookingLoading,
  selectBookingError,
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
  const stats = useSelector(selectBookingStats);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Debug current state
  console.log("🔍 BookingPage: Current state:", {
    bookings: bookings.length,
    bookingsArray: bookings,
    stats,
    loading,
    error,
    statsExists: !!stats,
    statsTotalBookings: stats?.totalBookings,
    shouldShowEmpty: !loading && !error && bookings.length === 0,
    shouldShowBookings: !loading && !error && bookings.length > 0,
    shouldShowLoading: loading,
  });

  // Fetch bookings data on component mount
  useEffect(() => {
    console.log("🔍 BookingPage: Fetching data...", { stats, loading, error });

    // Fetch all bookings
    dispatch(fetchUserBookings({ limit: 20 }))
      .unwrap()
      .then((result) => {
        console.log("✅ fetchUserBookings success:", result);
        console.log(
          "📦 Bookings data:",
          result?.data?.bookings || result?.bookings
        );
        console.log("📦 Full payload:", result);
      })
      .catch((error) => {
        console.error("❌ fetchUserBookings error:", error);
      });

    // Fetch upcoming bookings for quick access
    dispatch(fetchUpcomingBookings(5));

    // Fetch booking statistics
    dispatch(fetchBookingStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
                onClick={() => navigate("/my-bookings")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                View All Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Bookings
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.totalBookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats?.totalSpent || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.completedBookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.upcomingBookings || 0}
                </p>
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
            onAction={() => navigate("/services")}
          />
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {bookings.slice(0, 6).map((booking) => {
              // Helper functions for BookingCard style
              const formatCardDate = (dateString) => {
                if (!dateString) return "Date not set";
                const date = new Date(dateString);
                return date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              };

              const formatCardTime = (timeString) => {
                if (!timeString) return "Time not set";
                return timeString;
              };

              const getServiceNames = (services) => {
                if (!services || !Array.isArray(services))
                  return "Service details not available";
                return services
                  .map(
                    (service) =>
                      service.name || service.serviceName || "Unknown Service"
                  )
                  .join(", ");
              };

              const getPaymentMethodDisplay = (
                paymentStatus,
                paymentMethod
              ) => {
                if (paymentStatus === "paid" || paymentStatus === "completed") {
                  return "Paid";
                }
                if (
                  paymentMethod === "cod" ||
                  paymentMethod === "cash" ||
                  booking.metadata?.paymentMethod === "cod"
                ) {
                  return "Pay After Service";
                }
                return "Payment Pending";
              };

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                  onClick={() => handleViewBookingDetails(booking)}
                >
                  <div className="flex">
                    {/* Left Section - Pink Background with Logo */}
                    <div className="w-24 bg-gradient-to-br from-pink-400 to-pink-500 flex flex-col items-center justify-center p-4">
                      <div className="text-center">
                        <div className="text-white font-bold text-xs leading-tight">
                          <div className="text-pink-100">wemakeover</div>
                          <div className="text-pink-200">BOOKING</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Booking Details */}
                    <div className="flex-1 p-4">
                      {/* Service Details */}
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-gray-900 leading-tight">
                          {getServiceNames(booking.services)}
                        </h3>
                      </div>

                      {/* Date and Time */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-600">
                          <svg
                            className="w-3 h-3 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatCardDate(
                              booking.bookingDetails?.date || booking.date
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <svg
                            className="w-3 h-3 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {formatCardTime(
                              booking.bookingDetails?.slot || booking.timeSlot
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Payment:
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              booking.paymentStatus === "paid" ||
                              booking.paymentStatus === "completed"
                                ? "text-green-600"
                                : booking.paymentMethod === "cod" ||
                                  booking.paymentMethod === "cash" ||
                                  booking.metadata?.paymentMethod === "cod"
                                ? "text-orange-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {getPaymentMethodDisplay(
                              booking.paymentStatus,
                              booking.paymentMethod ||
                                booking.metadata?.paymentMethod
                            )}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewBookingDetails(booking);
                          }}
                          className="px-3 py-1 text-xs font-medium text-pink-600 border border-pink-300 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        >
                          View Booking Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!loading && bookings.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/my-bookings")}
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
              onClick={() => navigate("/services")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
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
