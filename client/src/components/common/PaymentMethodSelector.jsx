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
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Online Payment Option */}
      {showOnline && (
        <button
          onClick={() => onMethodChange("online")}
          disabled={disabled}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
            selectedMethod === "online"
              ? "border-[#CC2B52] bg-[#CC2B52] text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-base font-semibold">Pay Online</span>
            <span className="text-sm opacity-90">
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
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
            selectedMethod === "cod"
              ? "border-[#CC2B52] bg-[#CC2B52] text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-base font-semibold">Pay After Service</span>
            <span className="text-sm opacity-90">Pay cash to beautician</span>
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
