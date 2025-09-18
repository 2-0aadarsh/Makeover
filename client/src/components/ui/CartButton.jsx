import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiShoppingCart } from "react-icons/hi";

const CartButton = () => {
  const [itemCount] = useState(3); // This would typically come from Redux store
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <button
      onClick={handleCartClick}
      className="relative flex items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      style={{
        width: "40px",
        height: "40px",
        border: "2px solid #CC2B52",
        borderRadius: "50%",
      }}
      aria-label="Shopping cart"
    >
      {/* Cart Icon */}
      <HiShoppingCart className="text-[#CC2B52]" size={20} />

      {/* Item count badge */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#CC2B52] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
