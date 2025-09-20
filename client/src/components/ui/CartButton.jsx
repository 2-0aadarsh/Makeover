import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { HiShoppingCart } from "react-icons/hi";

const CartButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalServices } = useCart();

  // Check if we're on the cart page
  const isActive = location.pathname === "/cart";

  const handleCartClick = () => {
    console.log("🛒 Cart button clicked - navigating to cart page");
    navigate("/cart");
  };

  return (
    <button
      onClick={handleCartClick}
      className={`relative p-2 rounded-full transition-colors duration-200 ${
        isActive
          ? "bg-[#CC2B52] text-white"
          : "text-[#CC2B52] hover:bg-[#CC2B52]/10"
      }`}
      aria-label="Go to cart"
    >
      <HiShoppingCart
        className={isActive ? "text-white" : "text-[#CC2B52]"}
        size={20}
      />

      {/* Cart Badge */}
      {totalServices > 0 && (
        <span
          className={`absolute -top-1 -right-1 text-xs font-bold flex items-center justify-center min-w-[18px] h-[18px] px-1 ${
            isActive
              ? "bg-white text-[#CC2B52] rounded-full shadow-md border border-[#CC2B52]/20"
              : "bg-[#CC2B52] text-white rounded-full shadow-md"
          }`}
          style={{
            fontSize: "10px",
            lineHeight: "1",
          }}
        >
          {totalServices}
        </span>
      )}
    </button>
  );
};

export default CartButton;
