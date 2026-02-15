import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { FaShoppingCart, FaRegSadTear } from "react-icons/fa";
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
  // Transform cart items to match OrderSummary expected format (include optionLabel for variants)
  const services = cartItems.map((item) => ({
    name: item.cardHeader,
    description: item.description,
    price: parseFloat(item.price),
    quantity: item.quantity,
    image: item.img,
    id: item.id,
    category: item.category || 'Regular',
    duration: item.duration || 60,
    optionLabel: item.optionLabel || null,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          {/* Professional Empty Cart Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Main Cart Icon */}
              <div className="w-32 h-32 bg-gradient-to-br from-[#CC2B52] to-[#B02547] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaShoppingCart className="w-16 h-16 text-white" />
              </div>

              {/* Sad Face Overlay */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                <FaRegSadTear className="w-6 h-6 text-[#CC2B52]" />
              </div>
            </div>
          </div>

          {/* Empty Cart Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Your Beauty Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
            Oops! It looks like you haven't added any beauty services yet.
            Discover our amazing treatments and create your perfect beauty
            experience!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#B02547] hover:to-[#CC2B52] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Explore Services
            </button>
            <button
              onClick={() => handleScrollOrNavigate("gallery")}
              className="w-full sm:w-auto border-2 border-[#CC2B52] text-[#CC2B52] px-8 py-4 rounded-xl font-semibold hover:bg-[#CC2B52] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
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
