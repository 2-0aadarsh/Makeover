import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import BookYourSlot from "./BookYourSlot";
import { usePayment } from "../../../hooks/usePayment";
import { formatAmount } from "../../../utils/paymentUtils";

/**
 * Checkout Component
 *
 * Reusable component for payment checkout
 * Can be used directly in a page or as a modal
 */
const Checkout = ({
  totalAmount,
  onPaymentComplete,
  services = [],
  bookingDetails = {},
  isLoading = false,
  isModal = false,
  onClose = null,
  showBookSlot = true,
}) => {
  const dispatch = useDispatch();
  const { 
    completePaymentFlow, 
    completeCODFlow, 
    isLoading: paymentLoading, 
    hasError, 
    errorMessage,
    isPaymentSuccess,
    isPaymentFailed
  } = usePayment();

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [formValid, setFormValid] = useState(false);

  // Book Your Slot state
  const [selectedDate, setSelectedDate] = useState(bookingDetails.date || "");
  const [selectedSlot, setSelectedSlot] = useState(bookingDetails.slot || "");

  // Validate form based on selected payment method and booking slot
  useEffect(() => {
    let paymentValid = true; // Both payment methods are valid

    // If showBookSlot is true, also validate that date and slot are selected
    const bookingValid = showBookSlot ? selectedDate && selectedSlot : true;

    setFormValid(paymentValid && bookingValid);
  }, [
    paymentMethod,
    selectedDate,
    selectedSlot,
    showBookSlot,
  ]);

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(""); // Reset slot when date changes
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!formValid) return;

    try {
      // Prepare order data
      const orderData = {
        services: services,
        bookingDetails: {
          date: selectedDate,
          slot: selectedSlot,
          address: bookingDetails.address || {}
        },
        totalAmount: totalAmount,
        subtotal: totalAmount * 0.82, // Assuming 18% tax
        taxAmount: totalAmount * 0.18
      };

      if (paymentMethod === "online") {
        // Process online payment through Razorpay
        // This will:
        // 1. Create order on backend
        // 2. Open Razorpay modal (user stays on this page)
        // 3. Wait for user to complete payment
        // 4. Verify payment on backend
        // 5. Return result (only after successful verification)
        const result = await completePaymentFlow(orderData);
        
        // Only call onPaymentComplete if payment was successful
        // The promise resolves only after verification succeeds
        if (result && result.payload && onPaymentComplete) {
          onPaymentComplete(result.payload);
        }
      } else {
        // Process COD order - this completes immediately
        const result = await completeCODFlow(orderData);
        
        // Call the onPaymentComplete callback for COD
        if (result && result.payload && onPaymentComplete) {
          onPaymentComplete(result.payload.data || result.payload);
        }
      }

    } catch (error) {
      console.error('Payment submission error:', error);
      // Error is already handled by the payment hook
    }
  };

  // Render modal version with header and close button if isModal is true
  const content = (
    <div className={`${isModal ? "p-6 bg-white rounded-lg" : ""}`}>
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Checkout</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Book Your Slot Section */}
        {showBookSlot && (
          <div className="mb-6">
            <BookYourSlot
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Payment Method:
          </p>
          
          {/* Online Payment Option */}
          <div className="mb-4">
            <button
              onClick={() => handlePaymentMethodChange("online")}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === "online"
                  ? "border-[#CC2B52] bg-[#CC2B52] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-lg font-semibold">Pay Online</span>
                <span className="text-sm opacity-90">
                  UPI, Cards, Wallets & More
                </span>
              </div>
            </button>
          </div>

          {/* Cash on Delivery Option */}
          <div className="mb-4">
            <button
              onClick={() => handlePaymentMethodChange("cod")}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                paymentMethod === "cod"
                  ? "border-[#CC2B52] bg-[#CC2B52] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-lg font-semibold">Pay After Service</span>
                <span className="text-sm opacity-90">
                  Pay cash to beautician
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          {paymentMethod === "online" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💳</span>
                </div>
                <h3 className="text-sm font-semibold text-blue-800">
                  Secure Online Payment
                </h3>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                Pay securely with UPI, Credit/Debit Cards, Net Banking, Wallets, and more.
              </p>
              <p className="text-xs text-blue-600">
                Your payment information is encrypted and secure.
              </p>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💰</span>
                </div>
                <h3 className="text-sm font-semibold text-green-800">
                  Cash on Delivery
                </h3>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Pay cash directly to our beautician after service completion.
              </p>
              <p className="text-xs text-green-600">
                No advance payment required. Book now, pay later!
              </p>
            </div>
          )}
        </div>


        {/* Error Display */}
        {hasError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePaymentSubmit}
          disabled={!formValid || isLoading || paymentLoading}
          className={`w-full py-3 px-6 rounded-lg transition-colors text-white text-base font-semibold ${
            formValid && !isLoading && !paymentLoading
              ? "bg-[#CC2B52] hover:bg-[#CC2B52]/90 shadow-md hover:shadow-lg"
              : "bg-[#CC2B52BF] cursor-not-allowed"
          }`}
        >
          {isLoading || paymentLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : paymentMethod === "online" ? (
            `Pay ${formatAmount(totalAmount)}`
          ) : (
            "Book Now"
          )}
        </button>
      </div>
    </div>
  );

  // If it's a modal, wrap in a modal container
  if (isModal) {
    return content;
  }

  // Otherwise, return just the content
  return content;
};

Checkout.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
  services: PropTypes.array,
  bookingDetails: PropTypes.object,
  isLoading: PropTypes.bool,
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
  showBookSlot: PropTypes.bool,
};

export default Checkout;
