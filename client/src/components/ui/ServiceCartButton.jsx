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
    // If service has a unique service_id, use it
    if (serviceData.service_id) {
      return serviceData.service_id;
    }
    // Fallback to generated ID for backward compatibility
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
        className={`bg-[#CC2B52] hover:bg-[#CC2B52]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className}`}
      >
        Add +
      </button>
    );
  }

  // If item is in cart, show quantity selector "+ 1 -"
  return (
    <div
      className={`flex items-center bg-white border border-[#CC2B52] rounded-lg ${className}`}
    >
      {/* Decrement Button */}
      <button
        onClick={handleDecrement}
        className="px-3 py-2 text-[#CC2B52] hover:bg-[#CC2B52]/10 transition-colors duration-200 font-bold"
        aria-label="Decrease quantity"
      >
        -
      </button>

      {/* Quantity Display */}
      <span className="px-3 py-2 text-[#CC2B52] font-semibold min-w-[40px] text-center">
        {quantity}
      </span>

      {/* Increment Button */}
      <button
        onClick={handleIncrement}
        className="px-3 py-2 text-[#CC2B52] hover:bg-[#CC2B52]/10 transition-colors duration-200 font-bold"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default ServiceCartButton;
