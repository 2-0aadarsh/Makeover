import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CancelBookingModal from "../modals/CancelBookingModal.jsx";
import RescheduleBookingModal from "../modals/RescheduleBookingModal.jsx";
import CompletePaymentModal from "../modals/CompletePaymentModal.jsx";

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

  // Reschedule modal state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCompletingPayment, setIsCompletingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

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
              "We couldn't cancel this booking. Please try again or contact support."
          );
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelError(
        error?.message ||
          "We couldn't cancel this booking. Please try again or contact support."
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
    setRescheduleError(null);
    setIsRescheduleModalOpen(true);
  };

  // Handle confirming reschedule
  const handleConfirmReschedule = async (rescheduleData) => {
    console.log(
      "🔄 BookingDetails: Confirming reschedule with data:",
      rescheduleData
    );
    setIsRescheduling(true);
    try {
      if (onReschedule) {
        const result = await onReschedule({
          bookingId: booking._id,
          ...rescheduleData,
        });
        console.log("🔄 BookingDetails: Reschedule result:", result);

        if (result?.success) {
          setIsRescheduleModalOpen(false);
          setRescheduleError(null);
        } else {
          setRescheduleError(
            result?.message ||
              "We couldn't reschedule this booking. Please try again or contact support."
          );
        }
      }
    } catch (error) {
      console.error("❌ BookingDetails: Error rescheduling booking:", error);
      setRescheduleError(
        error?.message ||
          "We couldn't reschedule this booking. Please try again or contact support."
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  // Handle complete payment
  const handleCompletePayment = () => {
    console.log("💳 Opening payment modal for booking:", booking._id);
    setIsPaymentModalOpen(true);
    setPaymentError(null);
  };

  const handleConfirmPayment = async (paymentMethod, razorpayData = null) => {
    console.log("💳 Payment confirmation received:", {
      paymentMethod,
      hasRazorpayData: !!razorpayData,
    });

    setIsCompletingPayment(true);
    setPaymentError(null);

    try {
      // Call the parent handler with payment details
      if (onCompletePayment) {
        await onCompletePayment(booking._id, paymentMethod, razorpayData);
      }

      // Close modal on success
      setIsPaymentModalOpen(false);
      console.log("✅ Payment completed successfully");
    } catch (error) {
      console.error("❌ Payment completion failed:", error);
      setPaymentError(error.message || "Failed to complete payment");
    } finally {
      setIsCompletingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header - Improved mobile spacing */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Booking Details
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            View and manage your booking details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Services Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Booking Details
              </h2>

              {/* Services Table - Improved mobile layout */}
              <div className="space-y-4 sm:space-y-6">
                {booking.services?.map((service, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {/* Mobile Layout - Stacked */}
                    <div className="block sm:hidden">
                      {/* Service Header Row */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Service Image */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-gray-600"
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

                        {/* Service Name and Price */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {service.name}
                          </h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">
                              Qty: {service.quantity}
                            </span>
                            <span className="text-base font-bold text-gray-900">
                              {formatCurrency(service.price * service.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Service Description */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Price Breakdown */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Unit Price:</span>
                          <span className="text-gray-700">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
                      {/* Service Details */}
                      <div className="flex items-center gap-4 flex-1">
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

                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                              Qty: {service.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              Price: {formatCurrency(service.price)}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(service.price * service.quantity)}
                            </div>
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
                  <span className="text-lg sm:text-xl font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-24">
              {/* Booking Confirmation Header */}
              <div className="bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white text-center py-4 px-6">
                <h3 className="text-lg sm:text-xl font-bold">
                  Thanks For Booking With Makeover
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6">
                {/* Booking ID */}
                <div className="mb-4 sm:mb-6">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Booking ID
                    </p>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                      <p className="text-sm font-mono font-bold text-gray-900 break-all">
                        {booking.orderNumber || booking._id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Payment Method:
                      </span>
                      <span className="text-sm font-bold text-[#CC2B52]">
                        {getPaymentMethodDisplay(
                          booking.metadata?.paymentMethod ||
                            booking.paymentMethod
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Status */}
                <div className="mb-4 sm:mb-6 space-y-3">
                  <div className="flex items-center justify-between">
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
                <div className="mb-4 sm:mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                      Your booking is successfully placed for selected services
                      on{" "}
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
                            className="w-full py-2.5 px-4 border border-[#CC2B52] text-[#CC2B52] rounded-lg hover:bg-[#CC2B52] hover:text-white transition-all duration-200 font-medium text-sm"
                          >
                            Cancel Booking
                          </button>
                        )}

                        {/* Reschedule Button - Only show if booking can be rescheduled */}
                        {booking.canBeRescheduled !== false && (
                          <button
                            onClick={handleReschedule}
                            className="w-full py-2.5 px-4 border border-[#CC2B52] text-[#CC2B52] rounded-lg hover:bg-[#CC2B52] hover:text-white transition-all duration-200 font-medium text-sm"
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
                            className="w-full py-2.5 px-4 bg-[#CC2B52] text-white rounded-lg hover:bg-[#B02547] transition-all duration-200 font-medium text-sm"
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
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs sm:text-sm text-gray-600 text-center">
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
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Need help with your booking? Write us at{" "}
                    <a
                      href="mailto:hello@wemakeover.co.in"
                      className="text-[#CC2B52] hover:underline font-medium"
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

      {/* Reschedule Booking Modal */}
      <RescheduleBookingModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setRescheduleError(null);
        }}
        onConfirm={handleConfirmReschedule}
        booking={booking}
        isLoading={isRescheduling}
        errorMessage={rescheduleError}
      />

      {/* Complete Payment Modal */}
      <CompletePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentError(null);
        }}
        onConfirm={handleConfirmPayment}
        booking={booking}
        isLoading={isCompletingPayment}
        errorMessage={paymentError}
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
