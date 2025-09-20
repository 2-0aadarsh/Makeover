import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Checkout from "./Checkout";

/**
 * OrderSuccess Component
 *
 * Displays a success message after order completion with order details
 * Follows the Figma design for the success screen
 */
const OrderSuccess = ({ orderData, onGoHome }) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Format price to INR currency format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
    });
  };

  // Format time to readable format
  const formatTime = (timeString) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewBookingDetails = () => {
    // Navigate to booking details page
    navigate("/my-bookings");
  };

  const handleContinueBrowsing = () => {
    // Navigate back to home page
    onGoHome();
  };

  const handlePayNow = () => {
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentComplete = (paymentData) => {
    // Process payment and close modal
    console.log("Payment completed:", paymentData);
    setShowPaymentModal(false);
    // Show success message
    alert("Payment successful!");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center pt-16 pb-8">
      {/* Main Content */}
      <div className="w-full max-w-[603px] mx-auto flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 border border-dashed border-blue-300 rounded-lg">
        {/* Header */}
        <h1 className="font-['DM_Sans'] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-[100%] tracking-[0.01em] text-black mb-6 sm:mb-8 text-center">
          Thanks For Booking With Makeover 👋
        </h1>

        {/* Animation/Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-[150px] lg:h-[150px] flex items-center justify-center mb-6 sm:mb-8">
          <img
            src="/src/assets/modals/profile/polarBear.gif"
            alt="Success Animation"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>

        {/* Booking Message */}
        <div className="w-full text-center mb-8 sm:mb-12">
          <p className="font-['DM_Sans'] font-semibold text-sm sm:text-base md:text-[16px] leading-[200%] text-black px-2">
            Your booking is successful placed for selected services on{" "}
            {formatDate(orderData.appointmentDate)},{" "}
            {formatTime(orderData.appointmentTime)}.
            <br />
            You can pay {formatPrice(orderData.totalAmount)} now or after the
            service is complete
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[319px] mb-6 sm:mb-8">
          <button
            onClick={handleContinueBrowsing}
            className="w-full h-12 sm:h-[52px] border border-[#CC2B52] rounded-xl flex justify-center items-center hover:bg-[#CC2B52] hover:text-white transition-colors duration-200"
          >
            <span className="font-['DM_Sans'] font-normal text-base sm:text-lg md:text-[20px] leading-[100%] tracking-[0.01em] text-[#CC2B52] hover:text-white">
              Continue Browsing
            </span>
          </button>

          {/* Only show Pay Now button if payment method is cash */}
          {orderData.paymentMethod === "cash" && (
            <button
              onClick={handlePayNow}
              className="w-full h-12 sm:h-[52px] bg-[#CC2B52] rounded-xl flex justify-center items-center hover:bg-[#B02547] transition-colors duration-200"
            >
              <span className="font-['DM_Sans'] font-normal text-base sm:text-lg md:text-[20px] leading-[100%] tracking-[0.01em] text-white">
                Pay {formatPrice(orderData.totalAmount)} Now
              </span>
            </button>
          )}
        </div>

        {/* Booking Details Link */}
        <div className="text-center">
          <p className="font-['Roboto'] font-normal text-sm sm:text-base md:text-[16px] leading-[160%] tracking-[0.01em] text-[#313957] px-2">
            View booking details here{" "}
            <span
              className="text-[#CC2B52] cursor-pointer underline hover:no-underline transition-all duration-200"
              onClick={handleViewBookingDetails}
            >
              Booking Details
            </span>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12">
          <p className="font-['Roboto'] font-normal text-xs sm:text-[12px] leading-[100%] tracking-[0.01em] text-[#959CB6]">
            © MAKEOVER 2025 ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <Checkout
              totalAmount={orderData.totalAmount}
              onPaymentComplete={handlePaymentComplete}
              isModal={true}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

OrderSuccess.propTypes = {
  orderData: PropTypes.shape({
    orderId: PropTypes.string,
    appointmentDate: PropTypes.string,
    appointmentTime: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  onGoHome: PropTypes.func,
};

export default OrderSuccess;
