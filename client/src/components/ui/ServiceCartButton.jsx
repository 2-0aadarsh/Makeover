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

  // If item is not in cart, show "Add +" button
  if (quantity === 0) {
    return (
      <button
        onClick={handleAddToCart}
        className={`
          w-[90px] h-9 sm:h-10 lg:h-10 
          bg-[#CC2B52] hover:bg-[#B02547] 
          text-white 
          text-xs sm:text-sm lg:text-sm 
          font-semibold 
          rounded-lg 
          transition-all duration-200 
          shadow-sm hover:shadow-md
          flex items-center justify-center
          border border-[#CC2B52]
          ${className}
        `}
        aria-label={`Add ${serviceData.cardHeader} to cart`}
      >
        Add +
      </button>
    );
  }

  // If item is in cart, show quantity selector
  return (
    <div
      className={`
        w-[95px] h-9 sm:h-10 lg:h-10
        bg-white 
        border border-[#CC2B52] 
        rounded-lg 
        overflow-hidden
        shadow-sm
        flex items-stretch
        ${className}
      `}
    >
      {/* Decrement Button */}
      <button
        onClick={handleDecrement}
        className="
          w-7 sm:w-8 lg:w-8 
          flex items-center justify-center 
          bg-[#CC2B52] hover:bg-[#CC2B52] text-white hover:text-white 
          font-bold 
          text-sm sm:text-base lg:text-base
          transition-all duration-200
          border-r border-[#CC2B52]/30
        "
        aria-label="Decrease quantity"
      >
        -
      </button>

      {/* Quantity Display - Centered with proper spacing */}
      <div
        className="
          flex-1 
          flex items-center justify-center 
          bg-[#CC2B52] 
          font-semibold 
          text-xs sm:text-sm lg:text-sm
          min-w-[28px] sm:min-w-[32px] lg:min-w-[32px]
          px-1
          text-white
        "
      >
        {quantity}
      </div>

      {/* Increment Button */}
      <button
        onClick={handleIncrement}
        className="
          w-7 sm:w-8 lg:w-8 
          flex items-center justify-center 
          bg-[#CC2B52] hover:bg-[#CC2B52] text-white hover:text-white 
          font-bold 
          text-sm sm:text-base lg:text-base
          transition-all duration-200
          border-l border-[#CC2B52]/30
        "
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default ServiceCartButton;