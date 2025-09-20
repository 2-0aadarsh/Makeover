import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import PropTypes from "prop-types";
import Checkout from "./Checkout";

/**
 * OrderSummary Component
 *
 * A comprehensive component for displaying order summary and checkout interface
 * Follows the Figma design and provides interactive elements for quantity adjustment and payment selection
 */
const OrderSummary = ({
  services: initialServices = [],
  onPaymentComplete,
  onQuantityChange,
  isLoading = false,
}) => {
  // State management
  const [services, setServices] = useState(initialServices);

  // Update local services state when props change
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Calculate total amount from services
  const totalAmount = services.reduce((sum, service) => {
    return sum + service.price * service.quantity;
  }, 0);

  // Handle quantity changes for services
  const handleQuantityChange = (serviceIndex, change) => {
    const newServices = [...services];
    const currentQuantity = newServices[serviceIndex].quantity;
    const newQuantity = Math.max(1, currentQuantity + change);
    newServices[serviceIndex].quantity = newQuantity;
    setServices(newServices);

    // If onQuantityChange prop is provided, call it to update the cart
    if (onQuantityChange && newServices[serviceIndex].id) {
      onQuantityChange(newServices[serviceIndex].id, newQuantity);
    }
  };

  // Format price to INR currency format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle payment completion with services data
  const handleCheckoutComplete = (paymentData) => {
    if (onPaymentComplete) {
      onPaymentComplete({
        ...paymentData,
        services,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Main Content - Responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        {/* Order Summary Header - Moved to top level */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 font-['DM_Sans'] leading-6">
          Order Summary
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              {/* Table Header - Responsive layout */}
              <div className="hidden sm:flex justify-between items-start pb-6 border-b border-[#6C7275] h-[50px]">
                <div className="font-['DM_Sans'] font-semibold text-sm sm:text-base leading-[26px] text-[#121212]">
                  Service
                </div>
                <div className="flex justify-between items-center gap-[77px] w-[322px]">
                  <div className="font-['DM_Sans'] font-semibold text-sm sm:text-base leading-[26px] text-[#121212]">
                    Quantity
                  </div>
                  <div className="font-['DM_Sans'] font-semibold text-sm sm:text-base leading-[26px] text-[#121212]">
                    Price
                  </div>
                  <div className="font-['DM_Sans'] font-semibold text-sm sm:text-base leading-[26px] text-[#121212]">
                    Subtotal
                  </div>
                </div>
              </div>

              {/* Services Table */}
              {services.length > 0 ? (
                <div>
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 border-b border-[#E8ECEF] min-h-[160px] w-full gap-4"
                    >
                      {/* Service Image & Details - Responsive layout */}
                      <div className="flex flex-col sm:flex-row items-start p-3 sm:p-4 w-full sm:w-[285px] min-h-[112px] bg-[#F8F8F8] rounded-xl shadow-[0px_1px_4px_rgba(12,12,13,0.05)]">
                        <div className="flex items-center gap-3 sm:gap-[18px] w-full h-[80px]">
                          <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col items-start gap-1 sm:gap-[6px] flex-1">
                            <h3 className="font-['DM_Sans'] font-semibold text-xs leading-4 text-[#CC2B52] flex items-center">
                              {service.name}
                            </h3>
                            <div className="w-full h-0 border-[0.5px] border-[#DCDCDC]"></div>
                            <p className="font-['DM_Sans'] font-semibold text-xs sm:text-sm leading-[18px] flex items-center text-black w-full">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity, Price, Subtotal - Responsive layout */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-[62px] w-full sm:w-[328px]">
                        {/* Mobile: Show price and subtotal inline */}
                        <div className="flex justify-between items-center w-full sm:hidden">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">Price</span>
                            <p className="font-['DM_Sans'] font-normal text-sm text-[#121212]">
                              {formatPrice(service.price)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">
                              Subtotal
                            </span>
                            <p className="font-['DM_Sans'] font-bold text-sm text-[#121212]">
                              {formatPrice(service.price * service.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center border border-[#6C7275] rounded w-[80px] h-[32px] px-2">
                          <button
                            onClick={() => handleQuantityChange(index, -1)}
                            className="w-5 h-5 flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-[#121212]" />
                          </button>
                          <span className="w-full text-center font-['DM_Sans'] font-semibold text-xs">
                            {service.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            className="w-5 h-5 flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-[#121212]" />
                          </button>
                        </div>

                        {/* Desktop: Price and Subtotal */}
                        <div className="hidden sm:flex justify-between items-center gap-[62px]">
                          <div className="text-right">
                            <p className="font-['DM_Sans'] font-normal text-lg leading-[30px] text-[#121212]">
                              {formatPrice(service.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-['DM_Sans'] font-bold text-lg leading-[30px] text-[#121212]">
                              {formatPrice(service.price * service.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No services selected
                </div>
              )}

              {/* Total Amount */}
              <div className="flex justify-between items-center py-4 sm:py-6 pl-3 sm:pl-6 pr-0">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black font-['DM_Sans'] leading-6">
                  Total Amount:
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black font-['DM_Sans'] leading-6">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout */}
          <div className="bg-[#FAFAFA] rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Inter']">
              Checkout
            </h2>

            {/* Use the Checkout component */}
            <Checkout
              totalAmount={totalAmount}
              onPaymentComplete={handleCheckoutComplete}
              isLoading={isLoading}
              isModal={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string,
      id: PropTypes.string, // Add id prop for cart updates
    })
  ),
  onPaymentComplete: PropTypes.func,
  onQuantityChange: PropTypes.func, // Add onQuantityChange prop
  isLoading: PropTypes.bool,
};

export default OrderSummary;
