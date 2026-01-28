import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookingById,
  cancelBooking,
  rescheduleBooking,
  completeBookingPayment,
  selectCurrentBooking,
  selectBookingLoading,
  selectBookingError,
  clearErrors,
} from "../features/booking/bookingSlice.js";
import BookingDetails from "../components/booking/BookingDetails.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import SuccessModal from "../components/modals/SuccessModal.jsx";

/**
 * BookingDetailsPage Component
 *
 * Displays detailed view of a specific booking
 * Handles booking actions like cancel, reschedule, and payment
 */
const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const booking = useSelector(selectCurrentBooking);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Local state for tracking actions
  // eslint-disable-next-line no-unused-vars
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Success modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);

  // Fetch booking details on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  }, [dispatch, id]);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Handle cancel booking
  const handleCancelBooking = async (bookingData) => {
    setIsActionLoading(true);
    try {
      console.log("🔄 Cancelling booking with data:", bookingData);

      const result = await dispatch(
        cancelBooking({
          bookingId: bookingData._id,
          cancellationReason:
            bookingData.cancellationReason || "User requested cancellation",
        })
      );

      console.log("✅ Cancel booking result:", result);

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success
      ) {
        // Success - show custom success modal
        const refundInfo = result.payload.refundEligible
          ? `Refund of ₹${result.payload.refundAmount} will be processed within 5-7 business days.`
          : null;

        setSuccessMessage("Booking cancelled successfully!");
        setSuccessDetails(
          refundInfo
            ? `${refundInfo} You will receive a confirmation email shortly.`
            : "You will receive a confirmation email shortly."
        );
        setIsSuccessModalOpen(true);

        return { success: true, data: result.payload };
      }

      if (result.meta.requestStatus === "rejected") {
        const errorData = result.payload || result.error;
        const message =
          errorData?.message ||
          (Array.isArray(errorData?.errors)
            ? errorData.errors.join(", ")
            : "Failed to cancel booking");

        const detailedMessage = errorData?.supportEmail
          ? `${message} Please contact ${errorData.supportEmail} for assistance.`
          : message;

        return { success: false, message: detailedMessage };
      }

      const fallbackMessage =
        result.payload?.message ||
        result.error?.message ||
        "Failed to cancel booking";
      return { success: false, message: fallbackMessage };
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while cancelling the booking. Please try again.",
      };
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle reschedule booking
  const handleRescheduleBooking = async (rescheduleData) => {
    setIsActionLoading(true);
    try {
      console.log("🔄 Rescheduling booking with data:", rescheduleData);

      const result = await dispatch(
        rescheduleBooking({
          bookingId: rescheduleData.bookingId,
          newDate: rescheduleData.newDate,
          newSlot: rescheduleData.newSlot,
          newPaymentMethod: rescheduleData.newPaymentMethod,
          reason: rescheduleData.reason,
        })
      );

      console.log("✅ Reschedule booking result:", result);

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success
      ) {
        // Success - show custom success modal
        const rescheduleInfo = `Your booking has been rescheduled to ${rescheduleData.newDate} at ${rescheduleData.newSlot}.`;
        const remainingInfo = result.payload.remainingReschedules
          ? `You have ${result.payload.remainingReschedules} reschedule${
              result.payload.remainingReschedules > 1 ? "s" : ""
            } remaining.`
          : "This was your last reschedule.";

        setSuccessMessage("Booking rescheduled successfully!");
        setSuccessDetails(
          `${rescheduleInfo} ${remainingInfo} You will receive a confirmation email shortly.`
        );
        setIsSuccessModalOpen(true);

        // Refresh booking data
        dispatch(fetchBookingById(id));

        return { success: true, data: result.payload };
      }

      if (result.meta.requestStatus === "rejected") {
        const errorData = result.payload || result.error;
        const message =
          errorData?.message ||
          (Array.isArray(errorData?.errors)
            ? errorData.errors.join(", ")
            : "Failed to reschedule booking");

        const detailedMessage = errorData?.supportEmail
          ? `${message} Please contact ${errorData.supportEmail} for assistance.`
          : message;

        return { success: false, message: detailedMessage };
      }

      const fallbackMessage =
        result.payload?.message ||
        result.error?.message ||
        "Failed to reschedule booking";
      return { success: false, message: fallbackMessage };
    } catch (error) {
      console.error("❌ Error rescheduling booking:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while rescheduling the booking. Please try again.",
      };
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle complete payment
  const handleCompletePayment = async (
    bookingId,
    paymentMethod,
    razorpayData = null
  ) => {
    setIsActionLoading(true);
    try {
      console.log("💳 Completing payment for booking:", {
        bookingId,
        paymentMethod,
        hasRazorpayData: !!razorpayData,
      });

      const result = await dispatch(
        completeBookingPayment({
          bookingId,
          paymentMethod,
          razorpayOrderId: razorpayData?.razorpayOrderId,
          razorpayPaymentId: razorpayData?.razorpayPaymentId,
          razorpaySignature: razorpayData?.razorpaySignature,
        })
      );

      console.log("✅ Complete payment result:", result);

      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload?.success
      ) {
        // Success - show custom success modal
        const paymentInfo =
          paymentMethod === "online"
            ? `Payment of ₹${
                result.payload.data?.pricing?.totalAmount || 0
              } completed successfully via online payment.`
            : `Payment method updated to Pay After Service.`;

        setSuccessMessage("Payment Completed!");
        setSuccessDetails(
          `${paymentInfo} You will receive a confirmation email shortly.`
        );
        setIsSuccessModalOpen(true);

        // Refresh booking data
        dispatch(fetchBookingById(id));

        return { success: true, data: result.payload };
      }

      if (result.meta.requestStatus === "rejected") {
        const errorData = result.payload || result.error;
        const message =
          errorData?.message ||
          (Array.isArray(errorData?.errors)
            ? errorData.errors.join(", ")
            : "Failed to complete payment");

        console.error("❌ Payment completion failed:", message);
        throw new Error(message);
      }
    } catch (error) {
      console.error("❌ Error completing payment:", error);
      throw error; // Re-throw to be handled by BookingDetails
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  };

  // Handle success modal close and navigation
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
    setSuccessDetails(null);
    navigate("/my-bookings");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            retryText="Try Again"
          />
        </div>
      </div>
    );
  }

  // Empty state (booking not found)
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="Booking Not Found"
            description="The booking you're looking for doesn't exist or may have been removed."
            actionText="Back to Bookings"
            onAction={() => navigate("/my-bookings")}
          />
        </div>
      </div>
    );
  }

  // Success state - show booking details
  return (
    <>
      <BookingDetails
        booking={booking}
        onCancel={handleCancelBooking}
        onReschedule={handleRescheduleBooking}
        onCompletePayment={handleCompletePayment}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title={
          successMessage.includes("rescheduled")
            ? "Reschedule Successful"
            : successMessage.includes("Payment")
            ? "Payment Successful"
            : "Cancellation Successful"
        }
        message={successMessage}
        details={successDetails}
        buttonText="View My Bookings"
        onButtonClick={handleSuccessModalClose}
      />
    </>
  );
};

export default BookingDetailsPage;
