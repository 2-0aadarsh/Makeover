import { useCart } from "../../hooks/useCart";
import { getCartItemId } from "../../features/cart/cartItemId";

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

  // Use shared cart item ID so +/- match the id used by cart slice and backend
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
  const hasCustomSize = !!sizeConfig && (sizeConfig.width || sizeConfig.height);
  const formatDimension = (value) =>
    typeof value === "number" ? `${value}px` : value;
  const customStyle = hasCustomSize
    ? {
        width: sizeConfig?.width
          ? formatDimension(sizeConfig.width)
          : undefined,
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
    ? "h-[36px] sm:h-[40px] lg:h-[52px]"
    : "";
  const selectorHeightClass = hasCustomSize
    ? "h-full"
    : isFullWidth
    ? "h-[36px] sm:h-[40px] lg:h-[52px]"
    : "h-8 lg:h-[28px]";

  // Min width so [-] [qty] [+] never get clipped (9+32+9 = 50 → 36+32+36 ≈ 104px; lg 12+32+12 → 48+32+48 = 128px)
  const quantityMinWidth = hasCustomSize ? "" : "min-w-[7.5rem] sm:min-w-[8rem] lg:min-w-[8.5rem]";

  return (
    <div
      className={`${containerClasses} border border-[#CC2B52] bg-white ${containerWidthClass} ${containerHeightClass} ${quantityMinWidth} ${className}`}
      style={customStyle}
    >
      <div
        className={`flex items-center justify-between w-full min-w-0 ${selectorHeightClass}`}
      >
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          className={`${buttonBaseClasses} w-9 sm:w-10 lg:w-12 h-full min-w-[2.25rem] sm:min-w-10 lg:min-w-12 bg-[#CC2B52] hover:bg-[#CC2B52]/90 text-white font-bold text-base sm:text-lg lg:text-xl flex-shrink-0`}
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Quantity Display */}
        <span className="flex items-center justify-center flex-1 h-full min-w-[2rem] bg-[#CC2B52] text-white font-semibold text-sm sm:text-[13px] lg:text-[14px] border-l border-r border-[#CC2B52]/30 overflow-hidden">
          {quantity}
        </span>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          className={`${buttonBaseClasses} w-9 sm:w-10 lg:w-12 h-full min-w-[2.25rem] sm:min-w-10 lg:min-w-12 bg-[#CC2B52] hover:bg-[#CC2B52]/90 text-white font-bold text-base sm:text-lg lg:text-xl flex-shrink-0`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ServiceCartButton;
