import PropTypes from "prop-types";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

/**
 * SuccessModal Component
 *
 * A custom success modal that matches the application theme
 * Displays success messages with optional details and actions
 */
const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message,
  details = null,
  showIcon = true,
  buttonText = "OK",
  onButtonClick = null,
}) => {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-hidden overscroll-contain">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="p-6">
          {/* Icon */}
          {showIcon && (
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
            {title}
          </h2>

          {/* Main Message */}
          <p className="text-gray-600 text-center mb-4 leading-relaxed">
            {message}
          </p>

          {/* Additional Details (if provided) */}
          {details && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">{details}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleButtonClick}
            className="w-full py-3 px-6 bg-[#CC2B52] hover:bg-[#CC2B52]/90 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  details: PropTypes.string,
  showIcon: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default SuccessModal;
