import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import PropTypes from "prop-types";
import Checkout from "./Checkout";
import AddressDetail from "./AddressDetail";
import RemoveServiceModal from "../../modals/RemoveServiceModal";

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
  console.log("🔍 OrderSummary component rendered with:", {
    servicesCount: initialServices.length,
    onPaymentComplete: !!onPaymentComplete,
    onQuantityChange: !!onQuantityChange,
    isLoading,
  });
  // State management
  const [services, setServices] = useState(initialServices);
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentAddressObject, setCurrentAddressObject] = useState(null);

  // Modal state for remove confirmation
  const [removeModal, setRemoveModal] = useState({
    isOpen: false,
    serviceIndex: null,
    serviceName: "",
    serviceId: null,
  });

  // Initialize selectedDate with today's date to avoid past date validation errors
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedSlot, setSelectedSlot] = useState("");

  // State for showing/hiding breakup
  const [showBreakup, setShowBreakup] = useState(false);

  // Update local services state when props change
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Calculate subtotal from services (before fees)
  const subtotal = services.reduce((sum, service) => {
    return sum + service.price * service.quantity;
  }, 0);

  // Fixed fees (don't depend on quantity)
  const platformFee = 60;
  const transportationFee = 100;

  // Calculate total amount (subtotal + fixed fees)
  const totalAmount = subtotal + platformFee + transportationFee;

  console.log("🔍 OrderSummary calculations:", {
    services: services.map((s) => ({
      name: s.name,
      price: s.price,
      quantity: s.quantity,
      total: s.price * s.quantity,
    })),
    subtotal,
    platformFee,
    transportationFee,
    totalAmount,
  });

  // Handle quantity changes for services
  const handleQuantityChange = (serviceIndex, change) => {
    const currentQuantity = services[serviceIndex].quantity;

    // If trying to decrease quantity to 0, show confirmation modal
    if (currentQuantity === 1 && change === -1) {
      setRemoveModal({
        isOpen: true,
        serviceIndex,
        serviceName: services[serviceIndex].name,
        serviceId: services[serviceIndex].id,
      });
      return;
    }

    // Normal quantity change (increase or decrease when quantity > 1)
    const newServices = [...services];
    const newQuantity = Math.max(1, currentQuantity + change);
    newServices[serviceIndex].quantity = newQuantity;
    setServices(newServices);

    // If onQuantityChange prop is provided, call it to update the cart
    if (onQuantityChange && newServices[serviceIndex].id) {
      onQuantityChange(newServices[serviceIndex].id, newQuantity);
    }
  };

  // Handle confirmation to remove service
  const handleConfirmRemove = () => {
    if (removeModal.serviceId && onQuantityChange) {
      // Set quantity to 0, which will trigger removal in cart slice
      onQuantityChange(removeModal.serviceId, 0);
    }

    // Remove from local services state
    const newServices = services.filter(
      (_, index) => index !== removeModal.serviceIndex
    );
    setServices(newServices);

    // Close modal
    setRemoveModal({
      isOpen: false,
      serviceIndex: null,
      serviceName: "",
      serviceId: null,
    });
  };

  // Handle cancel - keep service at quantity 1
  const handleCancelRemove = () => {
    setRemoveModal({
      isOpen: false,
      serviceIndex: null,
      serviceName: "",
      serviceId: null,
    });
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

  // Handle address update
  const handleAddressUpdate = (newAddress, addressObject) => {
    setCurrentAddress(newAddress);
    setCurrentAddressObject(addressObject);
  };

  // Handle booking slot update
  const handleBookingUpdate = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  return (
    <>
      {/* Remove Service Confirmation Modal */}
      {removeModal.isOpen && (
        <RemoveServiceModal
          serviceName={removeModal.serviceName}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}

      <div className="min-h-screen bg-white pt-16">
        {/* Main Content - Responsive padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          {/* Order Summary Header - Moved to top level */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 font-['DM_Sans'] leading-6">
            Order Summary
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                {/* Table Header - Improved responsive layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-300">
                  <div className="col-span-6 font-['DM_Sans'] font-semibold text-base text-[#121212]">
                    Service
                  </div>
                  <div className="col-span-2 font-['DM_Sans'] font-semibold text-base text-[#121212] text-center">
                    Quantity
                  </div>
                  <div className="col-span-2 font-['DM_Sans'] font-semibold text-base text-[#121212] text-right">
                    Price
                  </div>
                  <div className="col-span-2 font-['DM_Sans'] font-semibold text-base text-[#121212] text-right">
                    Subtotal
                  </div>
                </div>

                {/* Services Table */}
                {services.length > 0 ? (
                  <div>
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="py-4 sm:py-6 border-b border-gray-200"
                      >
                        {/* Desktop Layout - Improved with grid */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                          {/* Service Details - Takes more space */}
                          <div className="col-span-6 flex items-center gap-3 min-w-0">
                            {/* Service Image */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/64x64/CC2B52/FFFFFF?text=" +
                                    service.name.charAt(0);
                                }}
                              />
                            </div>

                            {/* Service Info - Improved text handling */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-['DM_Sans'] font-semibold text-sm sm:text-base text-[#CC2B52] mb-1 truncate">
                                {service.name}
                              </h3>
                              <p
                                className="font-['DM_Sans'] text-xs text-gray-600 leading-relaxed overflow-hidden"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {service.description}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border border-gray-300 rounded-lg w-20 h-8">
                              <button
                                onClick={() => handleQuantityChange(index, -1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="flex-1 text-center font-['DM_Sans'] font-medium text-sm text-gray-800">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(index, 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-right">
                            <p className="font-['DM_Sans'] font-medium text-sm sm:text-base text-gray-800">
                              {formatPrice(service.price)}
                            </p>
                          </div>

                          {/* Subtotal */}
                          <div className="col-span-2 text-right">
                            <p className="font-['DM_Sans'] font-medium text-sm sm:text-base text-gray-800">
                              {formatPrice(service.price * service.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Mobile Layout - Improved */}
                        <div className="md:hidden space-y-4">
                          {/* Service Details */}
                          <div className="flex items-start gap-3">
                            {/* Service Image */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/64x64/CC2B52/FFFFFF?text=" +
                                    service.name.charAt(0);
                                }}
                              />
                            </div>

                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-['DM_Sans'] font-semibold text-sm text-[#CC2B52] mb-1">
                                {service.name}
                              </h3>
                              <p className="font-['DM_Sans'] text-xs text-gray-600 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          </div>

                          {/* Price, Quantity and Subtotal Row */}
                          <div className="flex justify-between items-center">
                            {/* Price and Subtotal */}
                            <div className="flex gap-4 sm:gap-6">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Price
                                </p>
                                <p className="font-['DM_Sans'] font-medium text-sm text-gray-800">
                                  {formatPrice(service.price)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Subtotal
                                </p>
                                <p className="font-['DM_Sans'] font-medium text-sm text-gray-800">
                                  {formatPrice(
                                    service.price * service.quantity
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg w-20 h-8">
                              <button
                                onClick={() => handleQuantityChange(index, -1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="flex-1 text-center font-['DM_Sans'] font-medium text-sm text-gray-800">
                                {service.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(index, 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
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

                {/* Total Amount Section */}
                <div className="py-4 sm:py-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 font-['DM_Sans']">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-gray-900 font-['DM_Sans']">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  {/* View/Hide Breakup Button */}
                  <button
                    onClick={() => setShowBreakup(!showBreakup)}
                    className="text-[#CC2B52] text-sm font-medium underline mt-3 hover:text-[#CC2B52]/80 transition-colors block text-right ml-auto"
                  >
                    {showBreakup ? "Hide Breakup" : "View Breakup"}
                  </button>
                </div>

                {/* Breakup Details - Conditionally Rendered */}
                {showBreakup && (
                  <div className="py-4 sm:py-6 space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 font-['DM_Sans']">
                        Subtotal:
                      </span>
                      <span className="text-sm text-gray-900 font-['DM_Sans']">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 font-['DM_Sans']">
                        Taxes & Platform Fee:
                      </span>
                      <span className="text-sm text-gray-900 font-['DM_Sans']">
                        {formatPrice(platformFee)}
                      </span>
                    </div>

                    {/* Transportation Fee */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 font-['DM_Sans']">
                        Transportation Fee:
                      </span>
                      <span className="text-sm text-gray-900 font-['DM_Sans']">
                        {formatPrice(transportationFee)}
                      </span>
                    </div>

                    {/* Total (in breakup) */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-base font-bold text-gray-900 font-['DM_Sans']">
                        Total:
                      </span>
                      <span className="text-base font-bold text-gray-900 font-['DM_Sans']">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Address and Checkout */}
            <div className="space-y-6">
              {/* Address Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <AddressDetail
                  currentAddress={currentAddress}
                  onAddressUpdate={handleAddressUpdate}
                  onBookingUpdate={handleBookingUpdate}
                />
              </div>

              {/* Checkout Section */}
              <div className="bg-[#FAFAFA] rounded-2xl shadow-sm p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Inter']">
                  Checkout
                </h2>

                {/* Use the Checkout component */}
                <Checkout
                  totalAmount={totalAmount}
                  onPaymentComplete={handleCheckoutComplete}
                  services={services}
                  bookingDetails={{
                    date: selectedDate,
                    slot: selectedSlot,
                    address: currentAddressObject || currentAddress,
                  }}
                  isLoading={isLoading}
                  isModal={false}
                  showBookSlot={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
