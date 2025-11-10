import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CancelBookingModal from "../modals/CancelBookingModal.jsx";

/**
 * BookingDetails Component
 *
 * Displays detailed booking information with booking ID, payment method,
 * services breakdown, and action buttons
 * Based on the static UI design from the images
 */
const BookingDetails = ({
  booking,
  onCancel,
  onReschedule,
  onCompletePayment,
}) => {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  // Format currency to INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time to readable format
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString; // Already formatted as "03:30 PM"
  };

  // Get payment method display text
  const getPaymentMethodDisplay = (paymentMethod) => {
    if (paymentMethod === "cod" || paymentMethod === "cash") {
      return "Pay After Service";
    }
    return "Online Payment";
  };

  // Get status badge styling - keeping original business colors
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
      confirmed: {
        text: "Confirmed",
        className: "bg-green-100 text-green-800",
      },
      in_progress: {
        text: "In Progress",
        className: "bg-blue-100 text-blue-800",
      },
      completed: { text: "Completed", className: "bg-gray-100 text-gray-800" },
      cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },
      no_show: { text: "No Show", className: "bg-orange-100 text-orange-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  // Get payment status badge - keeping original business colors
  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: {
        text: "Payment Pending",
        className: "bg-yellow-100 text-yellow-800",
      },
      processing: {
        text: "Processing",
        className: "bg-blue-100 text-blue-800",
      },
      completed: { text: "Paid", className: "bg-green-100 text-green-800" },
      failed: { text: "Payment Failed", className: "bg-red-100 text-red-800" },
      refunded: { text: "Refunded", className: "bg-gray-100 text-gray-800" },
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/myBookings");
  };

  // Handle opening cancel modal
  const handleCancel = () => {
    setCancelError(null);
    setIsCancelModalOpen(true);
  };

  // Handle confirming cancellation
  const handleConfirmCancel = async (cancellationReason) => {
    setIsCancelling(true);
    try {
      if (onCancel) {
        const result = await onCancel({ ...booking, cancellationReason });
        if (result?.success) {
          setIsCancelModalOpen(false);
          setCancelError(null);
        } else {
          setCancelError(
            result?.message ||
              "We couldn’t cancel this booking. Please try again or contact support."
          );
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelError(
        error?.message ||
          "We couldn’t cancel this booking. Please try again or contact support."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle closing cancel modal
  const handleCloseCancelModal = () => {
    if (!isCancelling) {
      setCancelError(null);
      setIsCancelModalOpen(false);
    }
  };

  // Handle reschedule booking
  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(booking);
    }
  };

  // Handle complete payment
  const handleCompletePayment = () => {
    if (onCompletePayment) {
      onCompletePayment(booking);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Bookings
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-2 text-gray-600">
            View and manage your booking details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Details
              </h2>

              {/* Services Table */}
              <div className="space-y-6">
                {booking.services?.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Service Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {service.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              Qty: {service.quantity}
                            </span>
                            <span className="text-sm text-gray-500">
                              Price: {formatCurrency(service.price)}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(service.price * service.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      booking.pricing?.totalAmount ||
                        booking.totalAmount ||
                        booking.services?.reduce(
                          (sum, service) =>
                            sum +
                            (service.price || 0) * (service.quantity || 1),
                          0
                        ) ||
                        0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {/* Booking Confirmation Header */}
              <div className="text-center mb-6 px-6 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thanks For Booking With Makeover
                </h3>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6">
                {/* Booking ID - Fixed Overflow Issue */}
                <div className="mb-6">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Booking ID
                    </p>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                      <p className="text-sm font-mono font-bold text-gray-900 break-all break-words">
                        {booking.orderNumber || booking._id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method - Keeping original red color */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Payment Method:
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {getPaymentMethodDisplay(
                          booking.metadata?.paymentMethod ||
                            booking.paymentMethod
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Status:
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Payment Status:
                    </span>
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>

                {/* Booking Information */}
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Your booking is successful placed for selected services on{" "}
                      <span className="font-semibold">
                        {formatDate(booking.bookingDetails?.date)}
                      </span>
                      {booking.bookingDetails?.slot && (
                        <>
                          ,{" "}
                          <span className="font-semibold">
                            {formatTime(booking.bookingDetails.slot)}
                          </span>
                        </>
                      )}
                      . You can pay{" "}
                      <span className="font-semibold">
                        {formatCurrency(
                          booking.totalAmount ||
                            booking.pricing?.totalAmount ||
                            0
                        )}
                      </span>{" "}
                      now or after the service is complete.
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Conditionally rendered based on booking status */}
                <div className="space-y-3">
                  {/* Show action buttons only for active bookings */}
                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" &&
                    booking.status !== "no_show" && (
                      <>
                        {/* Cancel Button - Only show if booking can be cancelled */}
                        {booking.canBeCancelled !== false && (
                          <button
                            onClick={handleCancel}
                            className="w-full py-2 px-4 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {/* Reschedule Button - Only show if booking can be rescheduled */}
                        {booking.canBeRescheduled !== false && (
                          <button
                            onClick={handleReschedule}
                            className="w-full py-2 px-4 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
                          >
                            Reschedule Booking
                          </button>
                        )}

                        {/* Complete Payment Button - Only for pending payments */}
                        {(booking.paymentStatus === "pending" ||
                          booking.metadata?.paymentMethod === "cod" ||
                          booking.paymentMethod === "cod") && (
                          <button
                            onClick={handleCompletePayment}
                            className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                          >
                            Complete Payment
                          </button>
                        )}
                      </>
                    )}

                  {/* Show message for cancelled/completed bookings */}
                  {(booking.status === "cancelled" ||
                    booking.status === "completed" ||
                    booking.status === "no_show") && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 text-center">
                        {booking.status === "cancelled" &&
                          "This booking has been cancelled. No further actions are available."}
                        {booking.status === "completed" &&
                          "This booking has been completed. Thank you for choosing our services!"}
                        {booking.status === "no_show" &&
                          "This booking was marked as no-show."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Help Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Need help with your booking? Write us at{" "}
                    <a
                      href="mailto:hello@wemakeover.co.in"
                      className="text-blue-600 hover:underline"
                    >
                      hello@wemakeover.co.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        booking={booking}
        isLoading={isCancelling}
        errorMessage={cancelError}
      />
    </div>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        image: PropTypes.string,
      })
    ),
    totalAmount: PropTypes.number,
    pricing: PropTypes.shape({
      totalAmount: PropTypes.number,
    }),
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    paymentMethod: PropTypes.string,
    metadata: PropTypes.shape({
      paymentMethod: PropTypes.string,
    }),
    bookingDetails: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string,
      address: PropTypes.object,
    }),
    canBeCancelled: PropTypes.bool,
    canBeRescheduled: PropTypes.bool,
  }).isRequired,
  onCancel: PropTypes.func,
  onReschedule: PropTypes.func,
  onCompletePayment: PropTypes.func,
};

export default BookingDetails;
