import React from "react";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

const BookingCard = ({ booking, onClick, onWriteReview }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not set";
    return timeString;
  };

  const getServiceNames = (services) => {
    if (!services || !Array.isArray(services))
      return "Service details not available";
    return services
      .map(
        (service) => service.name || service.serviceName || "Unknown Service"
      )
      .join(", ");
  };

  const getPaymentMethodDisplay = (paymentStatus, paymentMethod) => {
    if (paymentStatus === "paid" || paymentStatus === "completed") {
      return "Paid";
    }
    if (paymentMethod === "cod" || paymentMethod === "cash") {
      return "Pay After Service";
    }
    return "Payment Pending";
  };

  // Check if booking is cancelled
  const isCancelled = booking.status === "cancelled";
  const isCompleted = booking.status === "completed";
  const isNoShow = booking.status === "no_show";
  
  // Check review status
  const canBeReviewed = ["completed", "cancelled", "no_show"].includes(booking.status);
  const hasReviewed = booking.reviewDetails?.reviewSubmittedAt != null;
  const isPendingReview = canBeReviewed && !hasReviewed;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden ${
        isCancelled ? "opacity-75 border-2 border-red-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex relative">
        {/* Cancelled Badge Overlay */}
        {isCancelled && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
              Cancelled
            </span>
          </div>
        )}

        {/* Completed Badge Overlay */}
        {isCompleted && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
              Completed
            </span>
          </div>
        )}

        {/* No Show Badge Overlay */}
        {isNoShow && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">
              No Show
            </span>
          </div>
        )}

        {/* Left Section - Pink/Gray Background with Logo */}
        <div
          className={`w-24 ${
            isCancelled
              ? "bg-gradient-to-br from-gray-300 to-gray-400"
              : "bg-gradient-to-br from-pink-400 to-pink-500"
          } flex flex-col items-center justify-center p-4`}
        >
          <div className="text-center">
            <div className="text-white font-bold text-xs leading-tight">
              <div className={isCancelled ? "text-gray-100" : "text-pink-100"}>
                wemakeover
              </div>
              <div className={isCancelled ? "text-gray-200" : "text-pink-200"}>
                BOOKING
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Booking Details */}
        <div className="flex-1 p-4">
          {/* Service Details */}
          <div className="mb-3">
            <h3
              className={`text-sm font-medium leading-tight ${
                isCancelled
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
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
                {formatDate(booking.bookingDetails?.date || booking.date)}
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
                {formatTime(booking.bookingDetails?.slot || booking.timeSlot)}
              </span>
            </div>
          </div>

          {/* Payment Status / Booking Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              {/* Show cancellation status for cancelled bookings */}
              {isCancelled ? (
                <>
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className="text-xs font-semibold text-red-600">
                    Cancelled
                  </span>
                </>
              ) : isCompleted ? (
                <>
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className="text-xs font-semibold text-green-600">
                    Completed
                  </span>
                </>
              ) : isNoShow ? (
                <>
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className="text-xs font-semibold text-orange-600">
                    No Show
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-gray-500">Payment:</span>
                  <span
                    className={`text-xs font-medium ${
                      booking.paymentStatus === "paid" ||
                      booking.paymentStatus === "completed"
                        ? "text-green-600"
                        : booking.paymentMethod === "cod" ||
                          booking.paymentMethod === "cash"
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getPaymentMethodDisplay(
                      booking.paymentStatus,
                      booking.paymentMethod
                    )}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Review Status Badge - Show only for completed/cancelled/no_show bookings */}
          {canBeReviewed && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Review:</span>
                {hasReviewed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <Star className="w-3 h-3 fill-current" />
                    Reviewed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <Star className="w-3 h-3" />
                    Pending Review
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            {/* Write Review Button - Only show if pending review */}
            {isPendingReview && onWriteReview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWriteReview(booking);
                }}
                className="px-3 py-1 text-xs font-medium text-white bg-[#CC2B52] rounded-md hover:bg-[#B02547] focus:outline-none focus:ring-1 focus:ring-pink-500 flex items-center gap-1 transition-colors"
              >
                <Star className="w-3 h-3" />
                Write Review
              </button>
            )}
            
            {/* View Details Button */}
            <button className="px-3 py-1 text-xs font-medium text-pink-600 border border-pink-300 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-500">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onWriteReview: PropTypes.func,
};

export default BookingCard;
