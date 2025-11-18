import { useCart } from "../../hooks/useCart";

const ServiceCartButton = ({ serviceData, className = "" }) => {
  const {
    addItemToCart,
    incrementQuantity,
    decrementQuantity,
    getItemQuantity,
  } = useCart();

  // Get the quantity of this specific service in cart
  const quantity = getItemQuantity(serviceData);

  // Get cart item ID (use service_id if available, otherwise generate)
  const getCartItemId = (serviceData) => {
    if (serviceData.service_id) {
      return serviceData.service_id;
    }
    return `${serviceData.cardHeader}_${serviceData.price}_${
      serviceData.category || "default"
    }`;
  };

  const itemId = getCartItemId(serviceData);

  const handleAddToCart = () => {
    addItemToCart(serviceData);
  };

  const handleIncrement = () => {
    incrementQuantity(itemId);
  };

  const handleDecrement = () => {
    decrementQuantity(itemId);
  };

  // Fixed dimensions for consistent layout
  const buttonBaseClasses =
    "flex items-center justify-center transition-colors duration-200";
  const containerClasses = "rounded-lg font-medium overflow-hidden";

  // If item is not in cart, show "Add +" button
  if (quantity === 0) {
    return (
      <div
        className={`${containerClasses} bg-[#CC2B52] hover:bg-[#CC2B52]/90 ${className}`}
      >
        <button
          onClick={handleAddToCart}
          className={`${buttonBaseClasses} w-full h-10 sm:h-9 lg:h-10 text-white text-xs sm:text-[13px] lg:text-[14px] font-semibold px-4 sm:px-4 lg:px-4`}
          aria-label={`Add ${serviceData.cardHeader} to cart`}
        >
          Add +
        </button>
      </div>
    );
  }

  // If item is in cart, show quantity selector with same dimensions
  return (
    <div
      className={`${containerClasses} border border-[#CC2B52] bg-white ${className}`}
    >
      <div className="flex items-center justify-between w-full h-10 sm:h-9 lg:h-10">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          className={`${buttonBaseClasses} flex-1 h-full text-[#CC2B52] hover:bg-[#CC2B52]/10 font-bold text-sm sm:text-sm lg:text-sm`}
          aria-label="Decrease quantity"
        >
          -
        </button>

        {/* Quantity Display */}
        <span className="flex items-center justify-center flex-1 h-full text-[#CC2B52] font-semibold text-xs sm:text-[13px] lg:text-[14px] min-w-[24px] border-l border-r border-[#CC2B52]/30">
          {quantity}
        </span>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          className={`${buttonBaseClasses} flex-1 h-full text-[#CC2B52] hover:bg-[#CC2B52]/10 font-bold text-sm sm:text-sm lg:text-sm`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ServiceCartButton;
