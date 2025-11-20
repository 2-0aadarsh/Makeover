import { useCart } from "../../hooks/useCart";

const ServiceCartButton = ({
  serviceData,
  className = "",
  sizeConfig = null,
}) => {
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
  const containerClasses = "rounded-full font-medium overflow-hidden";
  const hasCustomSize =
    !!sizeConfig && (sizeConfig.width || sizeConfig.height);
  const formatDimension = (value) =>
    typeof value === "number" ? `${value}px` : value;
  const customStyle = hasCustomSize
    ? {
        width: sizeConfig?.width ? formatDimension(sizeConfig.width) : undefined,
        height: sizeConfig?.height
          ? formatDimension(sizeConfig.height)
          : undefined,
      }
    : undefined;

  // If item is not in cart, show "Add +" button
  if (quantity === 0) {
    const isFullWidth = className.includes("w-full");
    const containerWidthClass = hasCustomSize
      ? ""
      : isFullWidth
        ? "w-full"
        : "w-[80px] lg:w-[80px]";
    const containerHeightClass = hasCustomSize
      ? ""
      : isFullWidth
        ? "h-[28px] lg:h-[52px]"
        : "";
    const buttonHeightClass = hasCustomSize
      ? "h-full"
      : isFullWidth
        ? "h-[28px] lg:h-[52px]"
        : "h-8 lg:h-[28px]";

    return (
      <div
        className={`${containerClasses} bg-[#CC2B52] hover:bg-[#CC2B52]/90 ${containerWidthClass} ${containerHeightClass} ${className}`}
        style={customStyle}
      >
        <button
          onClick={handleAddToCart}
          className={`${buttonBaseClasses} w-full ${buttonHeightClass} text-white text-sm sm:text-[14px] lg:text-[15px] font-semibold px-2`}
          style={{
            alignItems: "center",
            paddingTop: undefined,
            height: hasCustomSize ? "100%" : undefined,
          }}
          aria-label={`Add ${serviceData.cardHeader} to cart`}
        >
          Add +
        </button>
      </div>
    );
  }

  // If item is in cart, show quantity selector with same dimensions
  const isFullWidth = className.includes("w-full");
  const containerWidthClass = hasCustomSize
    ? ""
    : isFullWidth
      ? "w-full"
      : "w-[80px] lg:w-[80px]";
  const containerHeightClass = hasCustomSize
    ? ""
    : isFullWidth
      ? "h-[28px] lg:h-[52px]"
      : "";
  const selectorHeightClass = hasCustomSize
    ? "h-full"
    : isFullWidth
      ? "h-[28px] lg:h-[52px]"
      : "h-8 lg:h-[28px]";

  return (
    <div
      className={`${containerClasses} border border-gray-300 bg-white ${containerWidthClass} ${containerHeightClass} ${className}`}
      style={customStyle}
    >
      <div
        className={`flex items-center justify-between w-full ${selectorHeightClass}`}
      >
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          className={`${buttonBaseClasses} flex-1 h-full text-gray-800 hover:bg-gray-100 font-bold text-base`}
          aria-label="Decrease quantity"
        >
          -
        </button>

        {/* Quantity Display */}
        <span className="flex items-center justify-center flex-1 h-full text-gray-900 font-semibold text-sm sm:text-[13px] lg:text-[14px] min-w-[32px] border-l border-r border-gray-200">
          {quantity}
        </span>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          className={`${buttonBaseClasses} flex-1 h-full text-gray-800 hover:bg-gray-100 font-bold text-base`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ServiceCartButton;
