import { useCart } from "../../hooks/useCart";
import { getCartItemId } from "../../features/cart/cartItemId";
import { MAX_QUANTITY_PER_SERVICE } from "../../features/cart/cartSlice";

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

  const quantity = getItemQuantity(serviceData);
  const itemId = getCartItemId(serviceData);

  const handleAddToCart = () => {
    addItemToCart(serviceData);
  };

  const handleIncrement = () => {
    if (quantity >= MAX_QUANTITY_PER_SERVICE) return;
    incrementQuantity(itemId);
  };

  const handleDecrement = () => {
    decrementQuantity(itemId);
  };

  const hasCustomSize = !!sizeConfig && (sizeConfig.width || sizeConfig.height);
  const isFullWidth = className.includes("w-full");
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

  const baseWidth = hasCustomSize ? "" : isFullWidth ? "w-full" : "w-[90px]";
  const baseHeight = hasCustomSize
    ? ""
    : isFullWidth
    ? "h-[28px] lg:h-[52px]"
    : "h-9 lg:h-10";

  // Add + button (quantity === 0)
  if (quantity === 0) {
    return (
      <button
        onClick={handleAddToCart}
        style={customStyle}
        className={`
          ${baseWidth} ${baseHeight}
          bg-[#CC2B52] hover:bg-[#B02547]
          text-white font-medium text-sm sm:text-[14px] lg:text-[15px]
          rounded-full transition-colors duration-200
          flex items-center justify-center
          ${hasCustomSize ? "w-full h-full" : ""}
          ${className}
        `}
        aria-label={`Add ${serviceData.cardHeader} to cart`}
      >
        Add +
      </button>
    );
  }

  // Quantity selector (item in cart)
  return (
    <div
      style={customStyle}
      className={`
        ${baseWidth} ${baseHeight}
        bg-[#CC2B52] rounded-full
        flex items-center justify-between overflow-hidden
        ${hasCustomSize ? "w-full h-full" : ""}
        ${className}
      `}
    >
      {/* Decrement – always active */}
      <button
        onClick={handleDecrement}
        className="w-8 h-full flex items-center justify-center text-white hover:bg-[#B02547] transition-colors duration-200 text-lg font-medium flex-shrink-0"
        aria-label="Decrease quantity"
      >
        −
      </button>

      {/* Quantity */}
      <span className="flex-1 text-center text-white text-sm font-medium min-w-0">
        {quantity}
      </span>

      {/* Increment – when at max: non-interactive div (no focus, cursor-not-allowed on hover) */}
      {quantity >= MAX_QUANTITY_PER_SERVICE ? (
        <div
          className="w-8 h-full flex items-center justify-center flex-shrink-0 opacity-50 cursor-not-allowed bg-[#CC2B52] text-white text-lg font-medium select-none"
          aria-label="Maximum quantity reached"
        >
          +
        </div>
      ) : (
        <button
          onClick={handleIncrement}
          className="w-8 h-full flex items-center justify-center flex-shrink-0 text-white hover:bg-[#B02547] transition-colors duration-200 text-lg font-medium bg-[#CC2B52]"
          aria-label="Increase quantity"
        >
          +
        </button>
      )}
    </div>
  );
};

export default ServiceCartButton;