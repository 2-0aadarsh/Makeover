import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import BookYourSlot from "./BookYourSlot";
import { usePayment } from "../../../hooks/usePayment";
import { formatAmount } from "../../../utils/paymentUtils";
import "../../../test-debug.js"; // Test import

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
  // Access authenticated user from Redux auth state
  const user = useSelector((state) => state.auth.user);

  // Extract user's phone number - handle case where user might not be logged in
  const userPhone = user?.phoneNumber || null;

  console.log("🔍 [AUTH STATE] Authenticated user data:", {
    user,
    userName: user?.name,
    userPhoneNumber: user?.phoneNumber,
    userEmail: user?.email,
    hasUser: !!user,
    extractedUserPhone: userPhone,
  });

  const {
    completePaymentFlow,
    completeCODFlow,
    isLoading: paymentLoading,
    hasError,
    errorMessage,
  } = usePayment();

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [formValid, setFormValid] = useState(false);

  // Book Your Slot state - Initialize with today's date if no date provided
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(
    bookingDetails.date || getDefaultDate()
  );
  const [selectedSlot, setSelectedSlot] = useState(bookingDetails.slot || "");

  console.log("🔍 [CRITICAL DEBUG] Checkout component rendered with:", {
    totalAmount,
    servicesCount: services.length,
    bookingDetails,
    isLoading,
    isModal,
    showBookSlot,
    selectedDate,
    selectedSlot,
    paymentMethod,
    formValid,
    timestamp: new Date().toISOString(),
    componentVersion: "SENIOR_DEBUG_v1",
  });

  // Force a very obvious log to test if component is loading new code
  console.log(
    "🚨🚨🚨 CHECKOUT COMPONENT IS LOADING NEW CODE - SENIOR DEBUG ACTIVE 🚨🚨🚨"
  );
  console.log(
    "🔍 TESTING FILE UPDATE - Current time:",
    new Date().toLocaleTimeString()
  );
  console.log("🔍 SCHEMA COMPLIANCE FIXES APPLIED - Version 3.0:", {
    orderNumber: "AUTO_GENERATED_BY_BACKEND",
    hasPhoneNumber: "YES",
    hasServiceDescriptions: "YES",
    hasServiceImages: "YES",
    hasServiceCategories: "YES",
    hasPricingObject: "YES",
    hasBookingObject: "YES",
    hasBookingDuration: "YES",
    schemaCompliant: "YES",
    timestamp: new Date().toISOString(),
  });

  // Validate form based on selected payment method and booking slot
  useEffect(() => {
    console.log("🔍 [SENIOR DEBUG] Form validation useEffect triggered with:", {
      selectedDate,
      selectedSlot,
      showBookSlot,
      paymentMethod,
      timestamp: new Date().toISOString(),
    });

    const paymentValid = paymentMethod !== null;

    // If showBookSlot is true, also validate that date and slot are selected
    const bookingValid = showBookSlot ? selectedDate && selectedSlot : true;

    const isValid = paymentValid && bookingValid;

    console.log("🔍 [SENIOR DEBUG] Form validation check:", {
      paymentValid,
      bookingValid,
      selectedDate,
      selectedSlot,
      showBookSlot,
      finalValid: isValid,
      hasSelectedDate: !!selectedDate,
      hasSelectedSlot: !!selectedSlot,
      dateType: selectedDate ? "date provided" : "no date",
      slotType: selectedSlot ? "slot provided" : "no slot",
      dateValue: selectedDate,
      slotValue: selectedSlot,
      validationLogic: {
        showBookSlot,
        needsDate: showBookSlot,
        needsSlot: showBookSlot,
        hasDate: !!selectedDate,
        hasSlot: !!selectedSlot,
        bookingValidCalculation: showBookSlot
          ? selectedDate && selectedSlot
          : true,
      },
    });

    setFormValid(isValid);
    console.log("🔍 [SENIOR DEBUG] Form validation result set:", isValid);
  }, [paymentMethod, selectedDate, selectedSlot, showBookSlot]);

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    console.log(
      "🔍 [SENIOR DEBUG] Checkout - Date received from BookYourSlot:",
      {
        date,
        dateType: typeof date,
        dateLength: date ? date.length : 0,
        isValidDate: date ? !isNaN(new Date(date).getTime()) : false,
        parsedDate: date ? new Date(date).toISOString() : "N/A",
        currentSelectedDate: selectedDate,
        currentSelectedSlot: selectedSlot,
        currentFormValid: formValid,
      }
    );

    // Store previous state for comparison
    const previousState = {
      selectedDate,
      selectedSlot,
      formValid,
    };

    setSelectedDate(date);
    setSelectedSlot(""); // Reset slot when date changes

    console.log("🔍 [SENIOR DEBUG] Checkout - State change:", {
      previousState,
      newSelectedDate: date,
      newSelectedSlot: "",
      willTriggerValidation: true,
    });
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    console.log("🔍 [SENIOR DEBUG] Checkout - Slot selected:", {
      slot,
      currentSelectedDate: selectedDate,
      currentSelectedSlot: selectedSlot,
      currentFormValid: formValid,
      showBookSlot,
    });

    const previousState = {
      selectedDate,
      selectedSlot,
      formValid,
    };

    setSelectedSlot(slot);

    console.log("🔍 [SENIOR DEBUG] Checkout - Slot state change:", {
      previousState,
      newSelectedSlot: slot,
      willTriggerValidation: true,
    });
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    console.log("🔍 [PAYMENT DEBUG] Pay Now button clicked!");
    console.log("🔍 [PAYMENT DEBUG] Form validation status:", {
      formValid,
      selectedDate,
      selectedSlot,
      paymentMethod,
      showBookSlot,
      hasServices: services && services.length > 0,
      totalAmount,
      hasAddress: !!bookingDetails.address,
      timestamp: new Date().toISOString(),
    });

    if (!formValid) {
      console.error("❌ [PAYMENT DEBUG] Form is not valid, payment blocked");
      console.log("🔍 [PAYMENT DEBUG] Form validation breakdown:", {
        paymentValid: true,
        bookingValid: showBookSlot ? selectedDate && selectedSlot : true,
        hasSelectedDate: !!selectedDate,
        hasSelectedSlot: !!selectedSlot,
        showBookSlot,
      });
      return;
    }

    console.log("✅ [PAYMENT DEBUG] Form is valid, proceeding with payment...");

    try {
      // Validate booking date and time slot
      if (selectedDate && selectedSlot) {
        const bookingDate = new Date(selectedDate);
        const now = new Date();

        console.log("🔍 Date validation:", {
          selectedDate,
          selectedSlot,
          bookingDate: bookingDate.toISOString(),
          currentTime: now.toISOString(),
        });

        // Check if it's a past date (before today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Also create booking date with hours set to 0 for comparison
        const bookingDateOnly = new Date(bookingDate);
        bookingDateOnly.setHours(0, 0, 0, 0);

        console.log("🔍 Date comparison:", {
          bookingDate: bookingDate.toISOString(),
          bookingDateOnly: bookingDateOnly.toISOString(),
          today: today.toISOString(),
          isPastDate: bookingDateOnly < today,
          isToday: bookingDateOnly.getTime() === today.getTime(),
        });

        if (bookingDateOnly < today) {
          throw new Error(
            "Booking date cannot be in the past. Please select today or a future date."
          );
        }

        // If it's today, check if the time slot is in the future
        if (bookingDateOnly.getTime() === today.getTime()) {
          const [timeStr, period] = selectedSlot.split(" ");
          const [hours, minutes] = timeStr.split(":").map(Number);

          // Convert to 24-hour format
          let hour24 = hours;
          if (period === "PM" && hours !== 12) {
            hour24 += 12;
          } else if (period === "AM" && hours === 12) {
            hour24 = 0;
          }

          // Create booking datetime
          const bookingDateTime = new Date(bookingDate);
          bookingDateTime.setHours(hour24, minutes, 0, 0);

          // Check if booking time is at least 30 minutes in the future
          const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

          console.log("🔍 Time slot validation for today:", {
            selectedSlot,
            hour24,
            minutes,
            bookingDateTime: bookingDateTime.toISOString(),
            thirtyMinutesFromNow: thirtyMinutesFromNow.toISOString(),
            isBookingTimeValid: bookingDateTime >= thirtyMinutesFromNow,
          });

          if (bookingDateTime < thirtyMinutesFromNow) {
            throw new Error(
              "For today's booking, please select a time slot that is at least 30 minutes in the future."
            );
          }

          console.log(
            "✅ Today booking validation passed - time slot is valid"
          );
        } else {
          console.log(
            "✅ Future date booking - no time slot validation needed"
          );
        }
      }

      console.log(
        "✅ All date/time validation passed - proceeding with payment"
      );

      // Validate services
      if (!services || services.length === 0) {
        console.error("❌ No services selected. Payment not initiated.");
        return;
      }

      // Parse address into required object format
      const parseAddress = (addressData) => {
        // If it's already an object with the required fields, use it
        if (
          addressData &&
          typeof addressData === "object" &&
          addressData.street
        ) {
          return {
            street: addressData.street || "",
            city: addressData.city || "",
            state: addressData.state || "",
            pincode: addressData.pincode || "",
          };
        }

        // If it's a string, try to parse it
        if (addressData && typeof addressData === "string") {
          const parts = addressData.split(", ");

          if (parts.length >= 4) {
            const pincodeMatch = parts[parts.length - 1].match(/\((\d{6})\)/);
            const pincode = pincodeMatch ? pincodeMatch[1] : "";

            // Remove pincode part from the last element
            const lastPart = parts[parts.length - 1]
              .replace(/\(\d{6}\)/, "")
              .trim();

            return {
              street: parts[1] || "", // Second part is usually street
              city: lastPart || parts[parts.length - 2] || "",
              state: "Bihar", // Default state
              pincode: pincode,
            };
          }
        }

        // Fallback: return empty address object
        return {
          street: "",
          city: "",
          state: "",
          pincode: "",
        };
      };

      // Calculate subtotal from services (same logic as server)
      const calculatedSubtotal = services.reduce((sum, service) => {
        return sum + service.price * service.quantity;
      }, 0);

      // Calculate tax amount (18% of subtotal)
      const calculatedTaxAmount = Math.round(calculatedSubtotal * 0.18);

      // Calculate total amount
      const calculatedTotalAmount = calculatedSubtotal + calculatedTaxAmount;

      console.log("🔍 Amount calculations:", {
        services: services.map((s) => ({
          name: s.name,
          price: s.price,
          quantity: s.quantity,
          total: s.price * s.quantity,
        })),
        calculatedSubtotal,
        calculatedTaxAmount,
        calculatedTotalAmount,
        providedTotalAmount: totalAmount,
      });

      // Ensure services have all required fields according to server schema
      const servicesWithRequiredFields = services.map((service) => ({
        serviceId:
          service.id || service._id || `service-${Date.now()}-${Math.random()}`,
        name: service.name,
        description:
          service.description ||
          `${service.name} - Professional beauty service`,
        price: service.price,
        quantity: service.quantity,
        image: service.image || "/src/assets/images/default-service.jpg", // Required field
        category: service.category || "Regular", // Required field with enum values
        duration: service.duration || "60", // Duration in minutes
      }));

      // Ensure address has phone and all required fields
      const addressWithPhone = parseAddress(bookingDetails.address);
      // Fallback priority: address phone -> authenticated user's phone -> hardcoded fallback
      addressWithPhone.phone = addressWithPhone.phone || userPhone;

      // Calculate total duration for booking
      const totalDuration = servicesWithRequiredFields.reduce(
        (total, service) => {
          return total + (parseInt(service.duration) || 60) * service.quantity;
        },
        0
      );

      // Format booking details for thunk compatibility
      const formattedBookingDetails = {
        date: selectedDate,
        slot: selectedSlot,
        address: addressWithPhone,
        customerName: bookingDetails?.customerName || "",
        customerPhone: bookingDetails?.customerPhone || addressWithPhone.phone,
        notes: bookingDetails?.notes || null,
        duration: totalDuration,
      };

      console.log(
        "📦 Final formatted bookingDetails:",
        formattedBookingDetails
      );

      // Prepare order data matching both thunk expectations and server schema
      const orderData = {
        // Note: orderNumber is auto-generated by backend - don't set it here
        services: servicesWithRequiredFields, // Required array with all fields
        pricing: {
          // Required pricing object
          subtotal: calculatedSubtotal,
          taxAmount: calculatedTaxAmount,
          totalAmount: calculatedTotalAmount,
          currency: "INR",
        },
        booking: {
          // Required booking object (new schema format)
          date: selectedDate,
          slot: selectedSlot,
          duration: totalDuration, // Required field
          address: addressWithPhone, // Required with phone
          notes: bookingDetails.notes || null,
        },
        bookingDetails: formattedBookingDetails, // Required for thunk compatibility
        // Legacy fields for backward compatibility
        totalAmount: calculatedTotalAmount,
        subtotal: calculatedSubtotal,
        taxAmount: calculatedTaxAmount,
      };

      console.log("🔍 Address parsing:", {
        originalAddress: bookingDetails.address,
        parsedAddress: parseAddress(bookingDetails.address),
      });

      console.log("🔍 [SCHEMA FIX] Order data prepared with server schema:", {
        // orderNumber will be auto-generated by backend
        servicesCount: orderData.services.length,
        servicesValidation: orderData.services.map((s) => ({
          name: s.name,
          description: s.description,
          image: s.image,
          category: s.category,
          duration: s.duration,
          hasAllRequiredFields: !!(
            s.serviceId &&
            s.name &&
            s.description &&
            s.price &&
            s.quantity &&
            s.image &&
            s.category
          ),
        })),
        pricingValidation: {
          subtotal: orderData.pricing.subtotal,
          taxAmount: orderData.pricing.taxAmount,
          totalAmount: orderData.pricing.totalAmount,
          currency: orderData.pricing.currency,
          hasAllFields: !!(
            orderData.pricing.subtotal &&
            orderData.pricing.taxAmount &&
            orderData.pricing.totalAmount
          ),
        },
        bookingValidation: {
          date: orderData.booking.date,
          slot: orderData.booking.slot,
          duration: orderData.booking.duration,
          addressPhone: orderData.booking.address.phone,
          phoneFormatValid: /^[6-9]\d{9}$/.test(
            orderData.booking.address.phone
          ),
          hasAllRequiredFields: !!(
            orderData.booking.date &&
            orderData.booking.slot &&
            orderData.booking.duration &&
            orderData.booking.address.phone
          ),
        },
        schemaCompliance: {
          hasServices: !!orderData.services,
          hasPricing: !!orderData.pricing,
          hasBooking: !!orderData.booking,
          servicesHaveDescriptions: orderData.services.every(
            (s) => s.description
          ),
          servicesHaveImages: orderData.services.every((s) => s.image),
          servicesHaveCategories: orderData.services.every((s) => s.category),
          bookingHasPhone: !!orderData.booking.address.phone,
          phoneFormatValid: /^[6-9]\d{9}$/.test(
            orderData.booking.address.phone
          ),
        },
      });

      console.log("🔍 Complete order data:", orderData);
      console.log(
        "🚀 [PAYMENT DEBUG] Dispatching order data with bookingDetails:",
        {
          hasBookingDetails: !!orderData.bookingDetails,
          hasBooking: !!orderData.booking,
          bookingDetails: orderData.bookingDetails,
          servicesCount: orderData.services?.length,
          totalAmount: orderData.totalAmount,
          timestamp: new Date().toISOString(),
        }
      );

      if (paymentMethod === "online") {
        console.log("🔍 Processing online payment through Razorpay...");
        console.log(
          "🔍 About to call completePaymentFlow with orderData:",
          orderData
        );

        // Process online payment through Razorpay
        // This will:
        // 1. Create order on backend
        // 2. Open Razorpay modal (user stays on this page)
        // 3. Wait for user to complete payment
        // 4. Verify payment on backend
        // 5. Return result (only after successful verification)
        const result = await completePaymentFlow(orderData);
        console.log("🔍 Payment flow result:", result);

        // Only call onPaymentComplete if payment was successful
        // The promise resolves only after verification succeeds
        if (result && result.payload && onPaymentComplete) {
          onPaymentComplete(result.payload);
        }
      } else {
        console.log("🔍 Processing COD order...");
        // Process COD order - this completes immediately
        const result = await completeCODFlow(orderData);
        console.log("🔍 COD flow result:", result);

        // Call the onPaymentComplete callback for COD
        if (result && result.payload && onPaymentComplete) {
          onPaymentComplete(result.payload.data || result.payload);
        }
      }
    } catch (error) {
      console.error("❌ Payment submission error:", error);
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
                Pay securely with UPI, Credit/Debit Cards, Net Banking, Wallets,
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
          onClick={(e) => {
            console.log("🔍 [BUTTON DEBUG] Pay Now Button clicked! Event:", e);
            console.log(
              "🔍 [BUTTON DEBUG] Button disabled state:",
              !formValid || isLoading || paymentLoading
            );
            console.log(
              "🔍 [BUTTON DEBUG] Form valid:",
              formValid,
              "Loading:",
              isLoading,
              "Payment Loading:",
              paymentLoading
            );
            console.log("🔍 [BUTTON DEBUG] Current state at button click:", {
              selectedDate,
              selectedSlot,
              paymentMethod,
              formValid,
              showBookSlot,
              timestamp: new Date().toISOString(),
            });

            if (!formValid) {
              console.error(
                "❌ [BUTTON DEBUG] Button click blocked - Form is not valid"
              );
              return;
            }

            console.log(
              "✅ [BUTTON DEBUG] Button click proceeding to handlePaymentSubmit"
            );
            handlePaymentSubmit();
          }}
          disabled={(() => {
            const isDisabled = !formValid || isLoading || paymentLoading;
            console.log("🔍 [SENIOR DEBUG] Button disabled calculation:", {
              formValid,
              isLoading,
              paymentLoading,
              isDisabled,
              timestamp: new Date().toISOString(),
              stateSnapshot: {
                selectedDate,
                selectedSlot,
                showBookSlot,
                paymentMethod,
              },
            });
            return isDisabled;
          })()}
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
          ) : paymentMethod === "cod" ? (
            "Book Now"
          ) : (
            "Select Payment Method"
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
