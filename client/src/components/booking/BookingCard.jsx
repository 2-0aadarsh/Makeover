import React from "react";
import PropTypes from "prop-types";

const BookingCard = ({ booking, onClick }) => {
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

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
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

          {/* Payment Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
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
            </div>
          </div>

          {/* View Details Button */}
          <div className="flex justify-end">
            <button className="px-3 py-1 text-xs font-medium text-pink-600 border border-pink-300 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-500">
              View Booking Details
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
};

export default BookingCard;
