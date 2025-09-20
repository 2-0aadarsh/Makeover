import { useCart } from "../../hooks/useCart";

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

  return (
    <div className="relative">
      {/* Cart Icon with Badge */}
      <button
        onClick={toggleCartModal}
        className="relative p-2 text-[#CC2B52] hover:bg-[#CC2B52]/10 rounded-full transition-colors duration-200"
        aria-label="Open cart"
      >
        <svg
          className="w-6 h-6"
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
          <span className="absolute -top-1 -right-1 bg-[#CC2B52] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Modal/Dropdown */}
      {isCartOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Cart ({totalItems} items)
              </h3>
              <button
                onClick={toggleCartModal}
                className="text-gray-400 hover:text-gray-600"
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
                <div key={item.id} className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {/* Item Image */}
                    <img
                      src={item.img}
                      alt={item.cardHeader}
                      className="w-12 h-12 object-cover rounded"
                    />

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
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
                        className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItemFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-[#CC2B52]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-[#CC2B52] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#CC2B52]/90 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDisplay;
