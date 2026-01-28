import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaymentMethodSelector from "../common/PaymentMethodSelector";
import { usePayment } from "../../hooks/usePayment";
import { useSelector } from "react-redux";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

/**
 * CompletePaymentModal Component
 *
 * Modal for completing payment on a pending booking
 * Allows user to choose payment method (online or COD) and proceed to payment
 */
const CompletePaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isLoading = false,
  errorMessage = null,
}) => {
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Get user data from Redux
  const user = useSelector((state) => state.auth.user);
  useBodyScrollLock(isOpen);

  // Use payment hook for Razorpay integration
  const { createPaymentOrder } = usePayment();

  // Initialize with empty payment method when modal opens (user must select)
  useEffect(() => {
    if (isOpen && booking) {
      // Don't pre-select any payment method - force user to choose
      setPaymentMethod(null);
      console.log(
        "💳 Modal opened - payment method reset to empty, user must select"
      );
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
    return paymentMethod === "online" || paymentMethod === "cod";
  };

  const toNumber = (value, fallback = 0) => {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (value === null || value === undefined) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const buildServicesPayload = () => {
    return (booking?.services || []).map((service, idx) => ({
      serviceId:
        service.serviceId ||
        service.id ||
        service._id ||
        `service-${service.name || "item"}-${idx}`,
      name: service.name,
      description:
        service.description ||
        `${service.name || "Service"} - Professional beauty service`,
      price: toNumber(service.price, 0),
      quantity: toNumber(service.quantity, 1),
      image: service.image || "/src/assets/images/default-service.jpg",
      category: service.category || "Regular",
      duration: service.duration || "60",
    }));
  };

  const normalizeAddressForPayment = (address = {}, fallbackAddress = {}) => {
    const safeString = (value) => {
      if (typeof value !== "string") return value || "";
      return value.trim();
    };

    const valueFrom = (key) => {
      if (address && address[key]) return address[key];
      if (fallbackAddress && fallbackAddress[key]) return fallbackAddress[key];
      return "";
    };

    const streetCandidates = [
      safeString(address?.street),
      safeString(address?.streetAreaName),
      safeString(address?.completeAddress),
      safeString(fallbackAddress?.street),
      safeString(fallbackAddress?.streetAreaName),
      safeString(fallbackAddress?.completeAddress),
    ].filter(Boolean);

    const city =
      safeString(valueFrom("city")) ||
      safeString(fallbackAddress?.address?.city) ||
      "";
    const state =
      safeString(valueFrom("state")) ||
      safeString(fallbackAddress?.address?.state) ||
      "Bihar";
    const pincode =
      safeString(valueFrom("pincode")) ||
      safeString(fallbackAddress?.address?.pincode) ||
      "";
    const country =
      safeString(valueFrom("country")) ||
      safeString(fallbackAddress?.address?.country) ||
      "India";

    return {
      street: streetCandidates[0] || "Address Line 1",
      streetAreaName:
        safeString(address?.streetAreaName) ||
        safeString(fallbackAddress?.streetAreaName) ||
        "",
      completeAddress:
        safeString(address?.completeAddress) ||
        safeString(fallbackAddress?.completeAddress) ||
        streetCandidates[0] ||
        "",
      houseFlatNumber:
        safeString(address?.houseFlatNumber) ||
        safeString(fallbackAddress?.houseFlatNumber) ||
        "",
      landmark:
        safeString(address?.landmark) ||
        safeString(fallbackAddress?.landmark) ||
        "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      country,
      phone: safeString(valueFrom("phone")) || "",
    };
  };

  // Handle confirm payment
  const handleConfirm = async () => {
    console.log("💳 [DEBUG] handleConfirm called");
    console.log("💳 [DEBUG] Current paymentMethod state:", paymentMethod);
    console.log("💳 [DEBUG] isFormValid:", isFormValid());

    if (!isFormValid()) {
      console.log("❌ [DEBUG] Form not valid, returning");
      return;
    }

    console.log(
      "💳 Complete payment modal: Confirming with method:",
      paymentMethod
    );

    // For COD, just call onConfirm directly
    if (paymentMethod === "cod") {
      console.log("💳 COD payment selected - calling onConfirm directly");
      onConfirm(paymentMethod, null);
      return;
    }

    // For online payment, initiate Razorpay flow
    if (paymentMethod === "online") {
      console.log(
        "💳 Online payment selected - initiating Razorpay for existing booking"
      );

      try {
        setIsProcessingPayment(true);

        const servicesPayload = buildServicesPayload();
        const servicesSubtotal = servicesPayload.reduce(
          (sum, service) => sum + service.price * service.quantity,
          0
        );

        const pricingSubtotal = toNumber(
          booking?.pricing?.subtotal ?? booking?.subtotal,
          servicesSubtotal
        );
        const pricingTax = toNumber(
          booking?.pricing?.taxAmount ?? booking?.taxAmount,
          Math.round(pricingSubtotal * 0.18)
        );
        const pricingTotal = toNumber(
          booking?.pricing?.totalAmount ?? booking?.totalAmount,
          pricingSubtotal + pricingTax
        );

        const pricingPayload = {
          subtotal: pricingSubtotal,
          taxAmount: pricingTax,
          totalAmount: pricingTotal,
          currency: booking?.pricing?.currency || "INR",
        };

        const rawAddress =
          booking?.bookingDetails?.address ||
          booking?.booking?.address ||
          booking?.address ||
          {};
        const backupAddress = {
          address: booking?.bookingDetails?.address || {},
          streetAreaName: booking?.bookingDetails?.streetAreaName,
          completeAddress: booking?.bookingDetails?.completeAddress,
          city: booking?.bookingDetails?.city,
          state: booking?.bookingDetails?.state,
          pincode: booking?.bookingDetails?.pincode,
          country: booking?.bookingDetails?.country,
          phone: booking?.bookingDetails?.customerPhone,
        };
        const normalizedAddress = normalizeAddressForPayment(
          rawAddress,
          backupAddress
        );
        normalizedAddress.phone =
          normalizedAddress.phone ||
          booking?.bookingDetails?.customerPhone ||
          booking?.userId?.phoneNumber ||
          user?.phoneNumber ||
          "";

        const totalDuration = servicesPayload.reduce((total, service) => {
          const minutes = parseInt(service.duration, 10);
          const safeMinutes = Number.isFinite(minutes) ? minutes : 60;
          return total + safeMinutes * (service.quantity || 1);
        }, 0);

        const bookingPayload = {
          date:
            booking?.booking?.date ||
            booking?.bookingDetails?.date ||
            booking?.date ||
            null,
          slot:
            booking?.booking?.slot ||
            booking?.bookingDetails?.slot ||
            booking?.slot ||
            "",
          duration:
            booking?.booking?.duration ||
            booking?.bookingDetails?.duration ||
            totalDuration,
          address: normalizedAddress,
          notes:
            booking?.booking?.notes ||
            booking?.bookingDetails?.notes ||
            booking?.notes ||
            null,
        };

        const customerName =
          booking?.bookingDetails?.customerName ||
          booking?.userId?.name ||
          user?.name ||
          "Customer";
        const customerEmail =
          booking?.bookingDetails?.customerEmail ||
          booking?.userId?.email ||
          user?.email ||
          "";
        const customerPhone =
          booking?.bookingDetails?.customerPhone ||
          normalizedAddress?.phone ||
          booking?.userId?.phoneNumber ||
          user?.phoneNumber ||
          "";

        const bookingDetailsPayload = {
          ...bookingPayload,
          customerName,
          customerPhone,
          customerEmail,
        };

        const orderData = {
          bookingId: booking._id,
          orderNumber: booking.orderNumber,
          services: servicesPayload,
          pricing: pricingPayload,
          booking: bookingPayload,
          bookingDetails: bookingDetailsPayload,
          totalAmount: pricingPayload.totalAmount,
          subtotal: pricingPayload.subtotal,
          taxAmount: pricingPayload.taxAmount,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
        };

        console.log(
          "💳 Creating Razorpay order for existing booking:",
          orderData
        );

        // Create Razorpay order
        const result = await createPaymentOrder(orderData);

        console.log("💳 Razorpay order created:", result);

        if (result.meta.requestStatus === "fulfilled" && result.payload?.data) {
          const razorpayOrder = result.payload.data;

          // Open Razorpay modal
          const razorpayOptions = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Wemakeover",
            description: `Payment for booking ${booking.orderNumber}`,
            order_id: razorpayOrder.id,
            prefill: {
              name: orderData.customer.name,
              email: orderData.customer.email,
              contact: orderData.customer.phone,
            },
            theme: {
              color: "#CC2B52",
            },
            handler: function (response) {
              console.log("✅ Razorpay payment successful:", response);

              // Prepare Razorpay data
              const razorpayData = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };

              // Call onConfirm with payment method and Razorpay data
              onConfirm(paymentMethod, razorpayData);
              setIsProcessingPayment(false);
            },
            modal: {
              ondismiss: function () {
                console.log("⚠️ Razorpay modal dismissed by user");
                setIsProcessingPayment(false);
              },
            },
          };

          console.log(
            "💳 Opening Razorpay modal with options:",
            razorpayOptions
          );

          // Open Razorpay
          const razorpay = new window.Razorpay(razorpayOptions);
          razorpay.open();
        } else {
          throw new Error("Failed to create Razorpay order");
        }
      } catch (error) {
        console.error("❌ Razorpay payment initiation failed:", error);
        setIsProcessingPayment(false);
        // Error will be shown in the modal via errorMessage prop
      }
    }
  };

  // Handle close
  const handleClose = () => {
    // Reset form
    setPaymentMethod(booking?.paymentDetails?.paymentMethod || null);
    onClose();
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    console.log(
      "💳 Complete payment modal: Payment method changed to:",
      method
    );
    setPaymentMethod(method);
  };

  // Calculate total amount
  const totalAmount =
    booking?.pricing?.totalAmount || booking?.totalAmount || 0;
  const currentPaymentMethod = booking?.paymentDetails?.paymentMethod || "cod";
  const paymentStatus = booking?.paymentStatus || "pending";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-blue-100 mt-1 text-sm">
                Choose your payment method
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-white hover:text-blue-100 transition-colors disabled:opacity-50"
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
          {/* Booking Summary */}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">
                  {booking?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Date:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(booking?.bookingDetails?.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot:</span>
                <span className="font-semibold text-gray-900">
                  {booking?.bookingDetails?.slot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`font-semibold ${
                    paymentStatus === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {paymentStatus === "pending" ? "Payment Pending" : "Paid"}
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

          {/* Current Payment Method */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5"
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
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Current Payment Method
                  </h4>
                  <p className="text-sm text-blue-700">
                    {currentPaymentMethod === "online"
                      ? "Pay Online (UPI, Cards, Wallets)"
                      : "Pay After Service (Cash on Delivery)"}
                  </p>
                </div>
              </div>
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

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
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
              Select Payment Method
            </h3>

            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
              showOnline={true}
              showCOD={currentPaymentMethod !== "cod"}
              disabled={isLoading || isProcessingPayment}
            />
          </div>

          {/* Payment Information */}
          {paymentMethod && (
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
                    You will be redirected to Razorpay to complete your payment
                    securely with UPI, Credit/Debit Cards, Net Banking, Wallets,
                    and more.
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
                      Pay After Service
                    </h3>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    You can pay cash directly to our beautician after service
                    completion.
                  </p>
                  <p className="text-xs text-green-600">
                    No advance payment required. Your booking remains confirmed!
                  </p>
                </div>
              )}
            </div>
          )}

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
              disabled={isLoading || isProcessingPayment || !isFormValid()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading || isProcessingPayment ? (
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
                  {isProcessingPayment
                    ? "Opening Razorpay..."
                    : "Processing..."}
                </>
              ) : paymentMethod === "online" ? (
                `Pay ${formatCurrency(totalAmount)}`
              ) : paymentMethod === "cod" ? (
                "Confirm Payment Method"
              ) : (
                "Select Payment Method"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CompletePaymentModal.propTypes = {
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
        description: PropTypes.string,
        image: PropTypes.string,
        category: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    bookingDetails: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string,
      address: PropTypes.object,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      customerName: PropTypes.string,
      customerPhone: PropTypes.string,
      customerEmail: PropTypes.string,
      notes: PropTypes.string,
      streetAreaName: PropTypes.string,
      completeAddress: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      pincode: PropTypes.string,
      country: PropTypes.string,
    }),
    booking: PropTypes.shape({
      date: PropTypes.string,
      slot: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      address: PropTypes.object,
      notes: PropTypes.string,
    }),
    date: PropTypes.string,
    slot: PropTypes.string,
    notes: PropTypes.string,
    address: PropTypes.object,
    pricing: PropTypes.shape({
      subtotal: PropTypes.number,
      taxAmount: PropTypes.number,
      totalAmount: PropTypes.number,
      currency: PropTypes.string,
    }),
    totalAmount: PropTypes.number,
    subtotal: PropTypes.number,
    taxAmount: PropTypes.number,
    paymentDetails: PropTypes.shape({
      paymentMethod: PropTypes.string,
    }),
    paymentStatus: PropTypes.string,
    userId: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
  }),
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default CompletePaymentModal;
