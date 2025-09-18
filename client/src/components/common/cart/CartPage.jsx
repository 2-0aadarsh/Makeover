import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Sample services data - in a real app, this would come from your cart or API
  const [services] = useState([
    {
      name: "Waxing",
      description: "Hand & Leg (Classic)",
      price: 1499,
      quantity: 1,
      image: "/src/assets/modals/waxing/classic/handsAndLegs-classic.png",
    },
    {
      name: "Cleanup & Facial",
      description: "De-Tan Facial",
      price: 999,
      quantity: 2,
      image: "/src/assets/modals/cleanup and facical/regular/DeTanFacial.png",
    },
    {
      name: "Manicure & Pedicure",
      description: "Manicure (Classic)",
      price: 499,
      quantity: 1,
      image:
        "/src/assets/modals/manicure and pedicure/classic/Manicure-classic.png",
    },
  ]);

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

  // Render based on current step
  if (currentStep === "success" && orderData) {
    return <OrderSuccess orderData={orderData} onGoHome={handleGoHome} />;
  }

  return (
    <OrderSummary
      services={services}
      onPaymentComplete={handlePaymentComplete}
      isLoading={isLoading}
    />
  );
};

export default CartPage;
