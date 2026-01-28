import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookYourSlot from "../common/bookings/BookYourSlot";
import PaymentMethodSelector from "../common/PaymentMethodSelector";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

/**
 * RescheduleBookingModal Component
 *
 * Modal for rescheduling a booking with date/slot selection and optional payment method change
 * Reuses BookYourSlot component for consistent UI
 */
const RescheduleBookingModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isLoading = false,
  errorMessage = null,
}) => {
  // State for new booking details
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  useBodyScrollLock(isOpen);

  // Initialize with current booking details when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setNewDate(booking.bookingDetails?.date || "");
      setNewSlot(booking.bookingDetails?.slot || "");
      setNewPaymentMethod(booking.paymentDetails?.paymentMethod || "");
      setRescheduleReason("");
    }
  }, [isOpen, booking]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Check if form is valid
  const isFormValid = () => {
    // Must have new date and slot
    if (!newDate || !newSlot) return false;

    // Check if anything has changed
    const dateChanged = newDate !== booking?.bookingDetails?.date;
    const slotChanged = newSlot !== booking?.bookingDetails?.slot;
    const paymentChanged =
      newPaymentMethod &&
      newPaymentMethod !== booking?.paymentDetails?.paymentMethod;

    return dateChanged || slotChanged || paymentChanged;
  };

  // Handle confirm reschedule
  const handleConfirm = () => {
    if (!isFormValid()) return;

    const rescheduleData = {
      newDate,
      newSlot,
    };

    // Add payment method if changed
    if (
      newPaymentMethod &&
      newPaymentMethod !== booking?.paymentDetails?.paymentMethod
    ) {
      rescheduleData.newPaymentMethod = newPaymentMethod;
    }

    // Add reason if provided
    if (rescheduleReason.trim()) {
      rescheduleData.reason = rescheduleReason.trim();
    }

    console.log("🔄 Reschedule modal: Confirming with data:", rescheduleData);
    onConfirm(rescheduleData);
  };

  // Handle close
  const handleClose = () => {
    // Reset form
    setNewDate(booking?.bookingDetails?.date || "");
    setNewSlot(booking?.bookingDetails?.slot || "");
    setNewPaymentMethod(booking?.paymentDetails?.paymentMethod || "");
    setRescheduleReason("");
    onClose();
  };

  // Handle date change from BookYourSlot
  const handleDateChange = (date) => {
    console.log("📅 Reschedule modal: Date changed to:", date);
    setNewDate(date);
    setNewSlot(""); // Reset slot when date changes
  };

  // Handle slot selection from BookYourSlot
  const handleSlotSelect = (slot) => {
    console.log("⏰ Reschedule modal: Slot selected:", slot);
    setNewSlot(slot);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    console.log("💳 Reschedule modal: Payment method changed to:", method);
    setNewPaymentMethod(method);
  };

  // Calculate reschedule info
  const rescheduleCount = booking?.reschedulingDetails?.rescheduleCount || 0;
  const remainingReschedules = 3 - rescheduleCount;
  const totalAmount =
    booking?.pricing?.totalAmount || booking?.totalAmount || 0;
  const currentPaymentMethod = booking?.paymentDetails?.paymentMethod || "cod";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#CC2B52] to-[#A91D3A] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reschedule Booking</h2>
              <p className="text-pink-100 mt-1 text-sm">
                {remainingReschedules > 0
                  ? `You have ${remainingReschedules} reschedule${
                      remainingReschedules > 1 ? "s" : ""
                    } remaining`
                  : "This is your last reschedule"}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-white hover:text-pink-100 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Current Booking Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">
                  {booking?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Date:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(booking?.bookingDetails?.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Time:</span>
                <span className="font-semibold text-gray-900">
                  {booking?.bookingDetails?.slot}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900 text-lg">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Services:
            </h3>
            <div className="space-y-2">
              {booking?.services?.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {service.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(service.price * service.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L12.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Book Your Slot Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-[#CC2B52]"
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
              Select New Date & Time
            </h3>
            <BookYourSlot
              selectedDate={newDate}
              onDateChange={handleDateChange}
              selectedSlot={newSlot}
              onSlotSelect={handleSlotSelect}
            />
          </div>

          {/* Payment Method Selection (Optional) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-[#CC2B52]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Payment Method{" "}
              <span className="text-gray-400 font-normal text-sm">
                (Optional)
              </span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Current:{" "}
              {currentPaymentMethod === "online"
                ? "Pay Online"
                : "Pay After Service"}
            </p>

            <PaymentMethodSelector
              selectedMethod={newPaymentMethod}
              onMethodChange={handlePaymentMethodChange}
              showOnline={true}
              showCOD={true}
              disabled={isLoading}
            />
          </div>

          {/* Reschedule Reason */}
          <div className="mb-6">
            <label
              htmlFor="rescheduleReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Rescheduling{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="rescheduleReason"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Please let us know why you're rescheduling..."
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {rescheduleReason.length}/500 characters
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-800 font-medium">
                  Reschedule Policy
                </p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• New date must be at least 4 hours from now</li>
                  <li>• Maximum 3 reschedules allowed per booking</li>
                  <li>• No additional charges for rescheduling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !isFormValid()}
              className="flex-1 px-4 py-3 bg-[#CC2B52] text-white rounded-lg font-semibold hover:bg-[#A91D3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Rescheduling...
                </>
              ) : (
                "Confirm Reschedule"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RescheduleBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  booking: PropTypes.shape({
    _id: PropTypes.string,
    orderNumber: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
    bookingDetails: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string,
    }),
    pricing: PropTypes.shape({
      totalAmount: PropTypes.number,
    }),
    totalAmount: PropTypes.number,
    paymentDetails: PropTypes.shape({
      paymentMethod: PropTypes.string,
    }),
    reschedulingDetails: PropTypes.shape({
      rescheduleCount: PropTypes.number,
    }),
  }),
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default RescheduleBookingModal;
