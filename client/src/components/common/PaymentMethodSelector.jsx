import PropTypes from "prop-types";

/**
 * PaymentMethodSelector Component
 *
 * Reusable payment method selector with two options: Pay Online and Pay After Service (COD)
 * Themed with brand colors and supports disabled state
 */
const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  showOnline = true,
  showCOD = true,
  disabled = false,
  className = "",
}) => {
  const baseButtonClasses =
    "w-full rounded-lg border-2 bg-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC2B52]/30";

  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      {/* Online Payment Option */}
      {showOnline && (
        <button
          onClick={() => onMethodChange("online")}
          disabled={disabled}
          className={`${baseButtonClasses} px-4 py-2.5 sm:py-3 ${
            selectedMethod === "online"
              ? "border-[#CC2B52] shadow-sm"
              : "border-gray-200 hover:border-[#CC2B52] hover:shadow-md"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center space-y-0.5">
            <span
              className={`text-sm sm:text-base font-semibold ${
                selectedMethod === "online" ? "text-[#CC2B52]" : "text-gray-900"
              }`}
            >
              Pay Online
            </span>
            <span
              className={`text-xs sm:text-sm ${
                selectedMethod === "online" ? "text-gray-600" : "text-gray-500"
              }`}
            >
              UPI, Cards, Wallets & More
            </span>
          </div>
        </button>
      )}

      {/* Cash on Delivery (Pay After Service) Option */}
      {showCOD && (
        <button
          onClick={() => onMethodChange("cod")}
          disabled={disabled}
          className={`${baseButtonClasses} px-4 py-2.5 sm:py-3 ${
            selectedMethod === "cod"
              ? "border-[#CC2B52] shadow-sm"
              : "border-gray-200 hover:border-[#CC2B52] hover:shadow-md"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center space-y-0.5">
            <span
              className={`text-sm sm:text-base font-semibold ${
                selectedMethod === "cod" ? "text-[#CC2B52]" : "text-gray-900"
              }`}
            >
              Pay After Service
            </span>
            <span
              className={`text-xs sm:text-sm ${
                selectedMethod === "cod" ? "text-gray-600" : "text-gray-500"
              }`}
            >
              Pay cash to beautician
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

PaymentMethodSelector.propTypes = {
  selectedMethod: PropTypes.oneOf(["online", "cod", null]),
  onMethodChange: PropTypes.func.isRequired,
  showOnline: PropTypes.bool,
  showCOD: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default PaymentMethodSelector;
