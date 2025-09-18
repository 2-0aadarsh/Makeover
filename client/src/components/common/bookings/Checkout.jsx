import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookYourSlot from "./BookYourSlot";

/**
 * Checkout Component
 *
 * Reusable component for payment checkout
 * Can be used directly in a page or as a modal
 */
const Checkout = ({
  totalAmount,
  onPaymentComplete,
  isLoading = false,
  isModal = false,
  onClose = null,
  showBookSlot = true,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cards");
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    saveDetails: false,
  });
  const [formValid, setFormValid] = useState(false);

  // Book Your Slot state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots] = useState([
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ]);

  // Sample admin availability data (in real app, this would come from API)
  // Empty arrays mean all future dates are available
  const [availableDates] = useState([]);
  const [unavailableDates] = useState([]);

  // UPI Apps
  const upiApps = [
    { id: "gpay", name: "Google Pay", logo: "/src/assets/payment/gpay.png" },
    { id: "paytm", name: "Paytm", logo: "/src/assets/payment/paytm.png" },
    { id: "phonepe", name: "PhonePe", logo: "/src/assets/payment/phonepe.png" },
    { id: "bhim", name: "BHIM", logo: "/src/assets/payment/bhim.png" },
  ];

  // Validate form based on selected payment method and booking slot
  useEffect(() => {
    let paymentValid = false;

    if (paymentMethod === "upi") {
      paymentValid = upiId.trim().length > 0;
    } else if (paymentMethod === "cards") {
      const { nameOnCard, cardNumber, expirationDate, cvv } = cardDetails;
      paymentValid =
        nameOnCard.trim().length > 0 &&
        cardNumber.trim().length > 0 &&
        expirationDate.trim().length > 0 &&
        cvv.trim().length > 0;
    } else if (paymentMethod === "cash") {
      paymentValid = true;
    }

    // If showBookSlot is true, also validate that date and slot are selected
    const bookingValid = showBookSlot ? selectedDate && selectedSlot : true;

    setFormValid(paymentValid && bookingValid);
  }, [
    paymentMethod,
    upiId,
    cardDetails,
    selectedDate,
    selectedSlot,
    showBookSlot,
  ]);

  // Handle card input changes
  const handleCardInputChange = (field, value) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
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
  const handlePaymentSubmit = () => {
    if (!formValid) return;

    // Prepare payment data
    const paymentData = {
      paymentMethod,
      totalAmount,
      ...(paymentMethod === "upi" && { upiId, selectedUpiApp }),
      ...(paymentMethod === "cards" && { cardDetails }),
      ...(showBookSlot && { selectedDate, selectedSlot }),
    };

    // Call the onPaymentComplete callback with the payment data
    if (onPaymentComplete) {
      onPaymentComplete(paymentData);
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
              availableSlots={availableSlots}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
              availableDates={availableDates}
              unavailableDates={unavailableDates}
            />
          </div>
        )}

        {/* Payment Method */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Payment Method:
          </p>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="appearance-none w-6 h-6 rounded-full border border-gray-400 checked:border-[#1AA428] focus:outline-none"
                />
                {paymentMethod === "upi" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1AA428]"></div>
                )}
              </div>
              <span className="text-gray-700 font-medium">
                <span className="text-gray-500 mr-1">LIP</span>
                UPI
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cards"
                  checked={paymentMethod === "cards"}
                  onChange={() => setPaymentMethod("cards")}
                  className="appearance-none w-6 h-6 rounded-full border border-gray-400 checked:border-[#1AA428] focus:outline-none"
                />
                {paymentMethod === "cards" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1AA428]"></div>
                )}
              </div>
              <span className="text-gray-700 font-medium">Cards</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="appearance-none w-6 h-6 rounded-full border border-gray-400 checked:border-[#1AA428] focus:outline-none"
                />
                {paymentMethod === "cash" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1AA428]"></div>
                )}
              </div>
              <span className="text-gray-700 font-medium">Cash</span>
            </label>
          </div>
        </div>

        {/* Payment method specific forms with fixed height */}
        <div className="min-h-[250px]">
          {/* UPI Options */}
          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Choose App
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {upiApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
                        selectedUpiApp === app.id
                          ? "border-[#1AA428] bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center mb-1">
                        <img
                          src={app.logo}
                          alt={app.name}
                          className="max-w-full max-h-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/40x40?text=${app.name.charAt(
                              0
                            )}`;
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Enter UPI ID
                </p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter your UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-r-lg hover:bg-gray-600">
                    Verify
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardDetails.saveDetails}
                    onChange={(e) =>
                      handleCardInputChange("saveDetails", e.target.checked)
                    }
                    className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                  />
                  <span className="text-sm text-gray-700">
                    Save details for future
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Card Details */}
          {paymentMethod === "cards" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name On Card
                </label>
                <input
                  type="text"
                  placeholder="Enter Name On Card"
                  value={cardDetails.nameOnCard}
                  onChange={(e) =>
                    handleCardInputChange("nameOnCard", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    handleCardInputChange("cardNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Expiration Date"
                    value={cardDetails.expirationDate}
                    onChange={(e) =>
                      handleCardInputChange("expirationDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="Enter CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      handleCardInputChange("cvv", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardDetails.saveDetails}
                    onChange={(e) =>
                      handleCardInputChange("saveDetails", e.target.checked)
                    }
                    className="w-4 h-4 text-[#CC2B52] border-gray-300 rounded focus:ring-[#CC2B52]"
                  />
                  <span className="text-sm text-gray-700">
                    Save details for future
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Cash Payment - Empty form but maintaining space */}
          {paymentMethod === "cash" && (
            <div className="flex flex-col justify-center items-center h-full py-8">
              <p className="text-gray-600 text-center mb-4">
                You&apos;ve selected to pay with cash.
              </p>
              <p className="text-gray-600 text-center">
                Payment will be collected after service completion.
              </p>
            </div>
          )}
        </div>

        {/* Pay Now Button - Always at the bottom */}
        <button
          onClick={handlePaymentSubmit}
          disabled={!formValid || isLoading}
          className={`w-full py-3 px-6 rounded transition-colors text-white text-base ${
            formValid && !isLoading
              ? "bg-[#CC2B52] hover:bg-[#CC2B52]/90"
              : "bg-[#CC2B52BF] cursor-not-allowed"
          }`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
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
  isLoading: PropTypes.bool,
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
  showBookSlot: PropTypes.bool,
};

export default Checkout;
