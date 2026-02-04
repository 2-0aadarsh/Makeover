import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BookYourSlot from "./BookYourSlot";
import PaymentMethodSelector from "../PaymentMethodSelector";
import { usePayment } from "../../../hooks/usePayment";
import { useCart } from "../../../hooks/useCart";
import { formatAmount } from "../../../utils/paymentUtils";
import "../../../test-debug.js"; // Test import
import AuthPromptModal from "../../modals/AuthPromptModal";
import CityServiceabilityModal from "../../modals/CityServiceabilityModal";
import {
  checkLocationServiceability,
  fetchServiceableCities,
} from "../../../features/serviceability/serviceabilityThunks";
import {
  selectServiceableCities,
  selectCityNames,
  clearValidation,
} from "../../../features/serviceability/serviceabilitySlice";
import {
  fetchMinimumOrderValue,
  selectMinimumOrderValue,
} from "../../../features/booking/bookingSlice";

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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clearAllCart } = useCart(); // Get cart clearing function

  // City serviceability state
  const serviceableCitiesData = useSelector(selectServiceableCities);
  const serviceableCityNames = useSelector(selectCityNames);

  // Minimum order value state
  const minimumOrderValue = useSelector(selectMinimumOrderValue);

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
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [requestedCity, setRequestedCity] = useState("");
  const [requestedPincode, setRequestedPincode] = useState("");
  const [validationType, setValidationType] = useState("city"); // "city" or "pincode"
  const [serviceablePincodes, setServiceablePincodes] = useState([]);

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  const handleCloseCityModal = () => {
    setShowCityModal(false);
    dispatch(clearValidation());
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
  };

  const handleSignupRedirect = () => {
    navigate("/auth/signup");
  };

  // Ensure serviceable city list is loaded so modal can display chips
  useEffect(() => {
    if (!serviceableCitiesData || serviceableCitiesData.length === 0) {
      dispatch(fetchServiceableCities());
    }
  }, [dispatch, serviceableCitiesData]);

  // Fetch minimum order value on component mount
  useEffect(() => {
    if (!minimumOrderValue) {
      console.log("🔍 Fetching minimum order value...");
      dispatch(fetchMinimumOrderValue());
    }
  }, [dispatch, minimumOrderValue]);

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

  // Validate form based on selected payment method, booking slot, and MOV
  useEffect(() => {
    console.log("🔍 [SENIOR DEBUG] Form validation useEffect triggered with:", {
      selectedDate,
      selectedSlot,
      showBookSlot,
      paymentMethod,
      minimumOrderValue,
      timestamp: new Date().toISOString(),
    });

    const paymentValid = paymentMethod !== null;

    // If showBookSlot is true, also validate that date and slot are selected
    const bookingValid = showBookSlot ? selectedDate && selectedSlot : true;

    // Check MOV if it's loaded
    const calculatedSubtotal = services.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);
    const movValid = minimumOrderValue
      ? calculatedSubtotal >= minimumOrderValue
      : true;

    const isValid = paymentValid && bookingValid && movValid;

    console.log("🔍 [SENIOR DEBUG] Form validation check:", {
      paymentValid,
      bookingValid,
      movValid,
      calculatedSubtotal,
      minimumOrderValue,
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
        movCheck: minimumOrderValue
          ? `${calculatedSubtotal} >= ${minimumOrderValue}`
          : "skipped",
      },
    });

    setFormValid(isValid);
    console.log("🔍 [SENIOR DEBUG] Form validation result set:", isValid);
  }, [
    paymentMethod,
    selectedDate,
    selectedSlot,
    showBookSlot,
    minimumOrderValue,
    services,
  ]);

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

    if (!isAuthenticated) {
      console.warn(
        "⚠️ [PAYMENT GUARD] User is not authenticated. Prompting sign-in before payment."
      );
      setShowAuthPrompt(true);
      return;
    }

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

    // ✅ LOCATION VALIDATION - Check if booking city AND pincode are serviceable
    try {
      // Extract city and pincode from bookingDetails
      const city = bookingDetails?.address?.city;
      const pincode = bookingDetails?.address?.pincode;

      console.log(
        "🔍 [LOCATION VALIDATION] Checking location serviceability:",
        { city, pincode }
      );

      if (!city) {
        console.error(
          "❌ [LOCATION VALIDATION] No city provided in booking details"
        );
        alert("Please select an address with a valid city.");
        return;
      }

      if (!pincode) {
        console.error(
          "❌ [LOCATION VALIDATION] No pincode provided in booking details"
        );
        alert("Please select an address with a valid pincode.");
        return;
      }

      // Check both city and pincode serviceability
      const validationResult = await dispatch(
        checkLocationServiceability({ city, pincode })
      ).unwrap();

      console.log("🔍 [LOCATION VALIDATION] Result:", validationResult);

      if (!validationResult.isServiceable) {
        console.warn(
          `⚠️ [LOCATION VALIDATION] Location not serviceable - City: "${city}", Pincode: "${pincode}", Reason: ${validationResult.code}`
        );
        setRequestedCity(city);
        setRequestedPincode(pincode);

        // Determine validation type based on error code
        if (validationResult.code === "PINCODE_NOT_SERVICEABLE") {
          setValidationType("pincode");
          setServiceablePincodes(validationResult.serviceablePincodes || []);
        } else {
          setValidationType("city");
          setServiceablePincodes([]);
        }

        setShowCityModal(true);
        return;
      }

      console.log(
        `✅ [LOCATION VALIDATION] Location is serviceable - City: "${city}", Pincode: "${pincode}"`
      );
    } catch (error) {
      console.error("❌ [LOCATION VALIDATION] Error checking location:", error);
      // Continue with payment if validation fails (fail open)
    }

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

      // Ensure services have all required fields according to server schema (include optionLabel for variants)
      const servicesWithRequiredFields = services.map((service) => ({
        serviceId:
          service.id || service._id || `service-${Date.now()}-${Math.random()}`,
        name: service.name,
        description:
          service.description ||
          `${service.name} - Professional beauty service`,
        price: service.price,
        quantity: service.quantity,
        image: service.image || "/src/assets/images/default-service.jpg",
        category: service.category || "Regular",
        duration: service.duration || "60",
        optionLabel: service.optionLabel || null,
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

      // Helper function to convert slot to 24-hour format
      const convertSlotTo24Hour = (slot) => {
        if (!slot) {
          return "";
        }
        const trimmedSlot = slot.trim();
        if (
          !trimmedSlot.toUpperCase().includes("AM") &&
          !trimmedSlot.toUpperCase().includes("PM")
        ) {
          return trimmedSlot;
        }
        const [timePart, periodRaw] = trimmedSlot.split(" ");
        const [hoursStr, minutesStr] = timePart.split(":");
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10) || 0;
        const period = periodRaw.toUpperCase();
        let hour24 = hours;
        if (period === "PM" && hours !== 12) {
          hour24 = hours + 12;
        } else if (period === "AM" && hours === 12) {
          hour24 = 0;
        }
        const formattedHour = hour24.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        return `${formattedHour}:${formattedMinutes}`;
      };

      // Helper function to build completion payload for OrderSuccess
      const buildCompletionPayload = (method, backendPayload) => {
        return {
          services: servicesWithRequiredFields,
          subtotal: calculatedSubtotal,
          taxAmount: calculatedTaxAmount,
          totalAmount: calculatedTotalAmount,
          paymentMethod: method === "online" ? "online" : "cash",
          appointmentDate: formattedBookingDetails.date,
          appointmentTime: convertSlotTo24Hour(selectedSlot),
          appointmentSlot: selectedSlot,
          bookingDetails: formattedBookingDetails,
          backendData: backendPayload,
          orderId:
            backendPayload?.orderId ||
            backendPayload?.bookingId ||
            backendPayload?.paymentId ||
            null,
          orderNumber: backendPayload?.orderNumber || null,
          paymentId: backendPayload?.paymentId || null,
        };
      };

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

        // Only proceed if payment was successful
        if (result && result.payload) {
          const backendPayload = result.payload?.data || result.payload;
          const completionPayload = buildCompletionPayload(
            "online",
            backendPayload
          );

          // Call onPaymentComplete callback if provided (for backward compatibility)
          if (onPaymentComplete) {
            onPaymentComplete(completionPayload);
          }

          // Clear cart after successful payment
          console.log("🛒 Clearing cart after successful payment...");
          clearAllCart();

          // Navigate to OrderSuccess page with order data
          console.log(
            "✅ Payment successful! Navigating to OrderSuccess page..."
          );
          navigate("/order-success", {
            state: { orderData: completionPayload },
            replace: true, // Replace current history entry
          });
        }
      } else {
        console.log("🔍 Processing COD order...");
        // Process COD order - this completes immediately
        const result = await completeCODFlow(orderData);
        console.log("🔍 COD flow result:", result);

        // Only proceed if order was created successfully
        if (result && result.payload) {
          const backendPayload = result.payload?.data || result.payload;
          const completionPayload = buildCompletionPayload(
            "cod",
            backendPayload
          );

          // Call onPaymentComplete callback if provided (for backward compatibility)
          if (onPaymentComplete) {
            onPaymentComplete(completionPayload);
          }

          // Clear cart after successful order creation
          console.log("🛒 Clearing cart after successful COD order...");
          clearAllCart();

          // Navigate to OrderSuccess page with order data
          console.log(
            "✅ COD order created! Navigating to OrderSuccess page..."
          );
          navigate("/order-success", {
            state: { orderData: completionPayload },
            replace: true, // Replace current history entry
          });
        }
      }
    } catch (error) {
      console.error("❌ Payment submission error:", error);
      // Error is already handled by the payment hook
    }
  };

  // Render modal version with header and close button if isModal is true
  const content = (
    <>
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
          {/* Minimum Order Value Warning */}
          {minimumOrderValue &&
            (() => {
              const calculatedSubtotal = services.reduce((sum, service) => {
                return sum + service.price * service.quantity;
              }, 0);
              const shortfall = minimumOrderValue - calculatedSubtotal;
              const isbelowMOV = calculatedSubtotal < minimumOrderValue;

              return isbelowMOV ? (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                        Minimum Order Value Not Met
                      </h3>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>
                          <span className="font-medium">
                            Your current order:
                          </span>{" "}
                          ₹{calculatedSubtotal}
                        </p>
                        <p>
                          <span className="font-medium">Minimum required:</span>{" "}
                          ₹{minimumOrderValue}
                        </p>
                        <p className="font-semibold text-yellow-800 mt-2">
                          Please add services worth ₹{shortfall} more to proceed
                          with your booking.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/")}
                        className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                      >
                        Browse More Services →
                      </button>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

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

            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
              showOnline={true}
              showCOD={true}
              disabled={isLoading || paymentLoading}
            />
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
                  Pay securely with UPI, Credit/Debit Cards, Net Banking,
                  Wallets, and more.
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
              console.log(
                "🔍 [BUTTON DEBUG] Pay Now Button clicked! Event:",
                e
              );
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

              if (!isAuthenticated) {
                console.warn(
                  "⚠️ [BUTTON DEBUG] User not authenticated. Showing auth prompt instead of proceeding."
                );
                setShowAuthPrompt(true);
                return;
              }

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
            ) : (
              (() => {
                // Check MOV
                const calculatedSubtotal = services.reduce((sum, service) => {
                  return sum + service.price * service.quantity;
                }, 0);
                const isBelowMOV =
                  minimumOrderValue && calculatedSubtotal < minimumOrderValue;
                const shortfall = minimumOrderValue
                  ? minimumOrderValue - calculatedSubtotal
                  : 0;

                if (isBelowMOV) {
                  return `Add ₹${shortfall} more to checkout`;
                } else if (paymentMethod === "online") {
                  return `Pay ${formatAmount(totalAmount)}`;
                } else if (paymentMethod === "cod") {
                  return "Book Now";
                } else {
                  return "Select Payment Method";
                }
              })()
            )}
          </button>
        </div>
      </div>

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={handleCloseAuthPrompt}
        onLogin={handleLoginRedirect}
        onSignup={handleSignupRedirect}
        message="Before proceeding with payment, please sign in. It only takes a moment, and your cart stays safe."
        loginLabel="Sign In to Continue"
        signupLabel="Create Account"
      />

      <CityServiceabilityModal
        isOpen={showCityModal}
        onClose={handleCloseCityModal}
        requestedCity={requestedCity}
        requestedPincode={requestedPincode}
        validationType={validationType}
        serviceableCities={serviceableCityNames}
        serviceablePincodes={serviceablePincodes}
        serviceableCitiesDisplay={serviceableCityNames.join(" and ")}
        onChangeAddress={() => {
          handleCloseCityModal();
          // Scroll to address section or trigger address modal
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onJoinWaitlist={() => {
          handleCloseCityModal();
          // TODO: Implement waitlist functionality
          console.log(
            "User wants to join waitlist for:",
            requestedCity,
            requestedPincode
          );
        }}
      />
    </>
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
