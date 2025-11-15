import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import AuthPromptModal from "../modals/AuthPromptModal";

const CartDisplay = () => {
  const {
    totalItems,
    total,
    items,
    isCartOpen,
    toggleCartModal,
    removeItemFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toggleCartModal();
      setShowAuthPrompt(true);
      return;
    }

    toggleCartModal();
    navigate("/cart");
  };

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  return (
    <>
    <div className="relative">
      {/* Cart Icon with Badge */}
      <button
        onClick={toggleCartModal}
          className="relative rounded-full p-2 text-[#CC2B52] transition-colors duration-200 hover:bg-[#CC2B52]/10"
        aria-label="Open cart"
      >
        <svg
            className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>

        {/* Cart Badge */}
        {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#CC2B52] text-xs font-semibold text-white">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Modal/Dropdown */}
      {isCartOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Cart Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Cart ({totalItems} items)
              </h3>
              <button
                onClick={toggleCartModal}
                  className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="max-h-64 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              items.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 p-4">
                  <div className="flex items-center space-x-3">
                    {/* Item Image */}
                    <img
                      src={item.img}
                      alt={item.cardHeader}
                        className="h-12 w-12 rounded object-cover"
                    />

                    {/* Item Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-gray-900">
                        {item.cardHeader}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ₹{item.price} {item.taxIncluded && "(Incl. Tax)"}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-sm transition-colors duration-200 hover:bg-gray-200"
                          aria-label="Decrease quantity"
                      >
                        -
                      </button>
                        <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                          className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-sm transition-colors duration-200 hover:bg-gray-200"
                          aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItemFromCart(item.id)}
                        className="text-xs text-red-500 transition-colors duration-200 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-[#CC2B52]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full rounded-lg bg-[#CC2B52] py-2 px-4 font-medium text-white transition-colors duration-200 hover:bg-[#B02547]"
                >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={handleCloseAuthPrompt}
      />
    </>
  );
};

export default CartDisplay;
