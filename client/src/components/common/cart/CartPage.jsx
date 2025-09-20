import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { useCart } from "../../../hooks/useCart";
import OrderSummary from "../bookings/OrderSummary";
import OrderSuccess from "../bookings/OrderSuccess";

/**
 * CartPage Component
 *
 * Main component that manages the cart/checkout flow
 * Handles state transitions between order summary and success screens
 */
const CartPage = () => {
  const [currentStep, setCurrentStep] = useState("summary"); // "summary" or "success"
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart data and actions from Redux
  const {
    items: cartItems,
    summary,
    clearAllCart,
    updateItemQuantity,
  } = useCart();
  console.log("🛒 CartPage - Cart Data:", {
    cartItems,
    summary,
    totalItems: summary.totalItems,
    totalServices: summary.totalServices,
    subtotal: summary.subtotal,
    taxAmount: summary.taxAmount,
    total: summary.total,
  });
  // Transform cart items to match OrderSummary expected format
  const services = cartItems.map((item) => ({
    name: item.cardHeader,
    description: item.description,
    price: parseFloat(item.price),
    quantity: item.quantity,
    image: item.img,
    id: item.id, // Add cart item ID for updates
  }));

  // Handle quantity changes from OrderSummary
  const handleQuantityChange = (serviceId, newQuantity) => {
    console.log("🛒 CartPage - Quantity change requested:", {
      serviceId,
      newQuantity,
      cartItemId: serviceId,
    });

    // Update quantity in Redux cart
    updateItemQuantity(serviceId, newQuantity);
  };

  // Handle payment completion
  const handlePaymentComplete = async (data) => {
    setIsLoading(true);

    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add order ID and date to the data
      const completeOrderData = {
        ...data,
        orderId: "MAK" + Date.now().toString().slice(-8),
        appointmentDate: "2024-07-18", // Sample date
        appointmentTime: "15:30", // Sample time (24-hour format)
        totalAmount: calculateTotal(data.services),
        paymentMethod: data.paymentMethod || "cash", // Default to cash if not specified
      };

      // Save order data and move to success screen
      setOrderData(completeOrderData);
      setCurrentStep("success");

      // Clear cart after successful order
      clearAllCart();
    } catch (error) {
      console.error("Payment processing error:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total amount from services
  const calculateTotal = (services) => {
    return services.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );
  };

  // Handle navigation to home
  const handleGoHome = () => {
    navigate("/");
  };

  // Handle scroll or navigate to gallery section (same logic as header)
  const handleScrollOrNavigate = (sectionId) => {
    if (location.pathname === "/") {
      // Already on home page → just scroll
      scroller.scrollTo(sectionId, {
        smooth: true,
        duration: 800,
        offset: -100, // Adjust for sticky header
      });
    } else {
      // Navigate to home, then scroll after page load
      navigate("/", { replace: false });
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          smooth: true,
          duration: 800,
          offset: -100,
        });
      }, 100); // small delay for home to mount
    }
  };

  // Show empty cart state if no items
  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Empty Cart Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
          </div>

          {/* Empty Cart Message */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Looks like you haven't added any services yet. Browse our amazing
            makeover services and add them to your cart!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto bg-[#CC2B52] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#B02547] transition-colors duration-200"
            >
              Browse Services
            </button>
            <button
              onClick={() => handleScrollOrNavigate("gallery")}
              className="w-full sm:w-auto border border-[#CC2B52] text-[#CC2B52] px-6 py-3 rounded-lg font-medium hover:bg-[#CC2B52] hover:text-white transition-colors duration-200"
            >
              View Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on current step
  if (currentStep === "success" && orderData) {
    return <OrderSuccess orderData={orderData} onGoHome={handleGoHome} />;
  }

  return (
    <OrderSummary
      services={services}
      onPaymentComplete={handlePaymentComplete}
      onQuantityChange={handleQuantityChange}
      isLoading={isLoading}
    />
  );
};

export default CartPage;
