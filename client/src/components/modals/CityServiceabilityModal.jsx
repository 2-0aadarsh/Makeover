import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { HiLocationMarker, HiX } from "react-icons/hi";
import { MdRocketLaunch } from "react-icons/md";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

/**
 * CityServiceabilityModal
 *
 * Professional modal displayed when user tries to book from non-serviceable city
 * Shows available cities and option to join waitlist
 */
const CityServiceabilityModal = ({
  isOpen,
  onClose,
  requestedCity,
  requestedPincode,
  validationType = "city", // "city" or "pincode"
  serviceableCities = [],
  serviceablePincodes = [],
  onChangeAddress,
  onJoinWaitlist,
}) => {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  // Determine if it's a pincode issue or city issue
  const isPincodeIssue =
    validationType === "pincode" ||
    (requestedPincode && serviceablePincodes.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-[#CC2B52] to-[#B02547] p-4 text-white flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <HiX size={20} />
              </button>

              {/* Compact Header Content */}
              <div className="flex items-center gap-3 pr-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 flex-shrink-0">
                  <MdRocketLaunch className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate">
                    {isPincodeIssue
                      ? `Expanding in ${requestedCity}!`
                      : `Coming Soon to ${requestedCity}!`}
                  </h2>
                  <p className="text-white/90 text-xs truncate">
                    {isPincodeIssue ? (
                      <>
                        {"We're expanding our coverage in "}
                        {requestedCity}
                      </>
                    ) : (
                      "We're expanding to your city"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
<<<<<<< HEAD
            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-modal-scroll>
=======
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
>>>>>>> 2e2ce50b2159a868378619e63443519cc5886ae8
              {/* Message */}
              <div className="text-center">
                {isPincodeIssue ? (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {"We're expanding in "}
                    <span className="font-semibold text-[#CC2B52]">
                      {requestedCity}
                    </span>
                    {"! Currently, we don't cover pincode "}
                    <span className="font-semibold text-[#CC2B52]">
                      {requestedPincode}
                    </span>
                    .
                    {serviceablePincodes.length > 0 &&
                      " Please check if you have another address in a serviceable pincode, or change to a different city."}
                  </p>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {"We're thrilled to bring our services to "}
                    <span className="font-semibold text-[#CC2B52]">
                      {requestedCity}
                    </span>
                    {
                      "! While we work on expanding, you can book our services in:"
                    }
                  </p>
                )}
              </div>

              {/* Available Cities or Pincodes */}
              {isPincodeIssue && serviceablePincodes.length > 0 ? (
                <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <HiLocationMarker className="text-[#CC2B52]" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-xs">
                        Serviceable Pincodes in {requestedCity}:
                      </h3>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {serviceablePincodes.map((pincode, index) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded text-xs border border-pink-200 flex-shrink-0"
                          >
                            <span className="text-[#CC2B52] font-medium">
                              {pincode}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <HiLocationMarker className="text-[#CC2B52]" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-xs">
                        Currently Available In:
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {serviceableCities.map((city, index) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded text-xs border border-pink-200 flex-shrink-0"
                          >
                            <span className="text-[#CC2B52] font-medium">
                              {city}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Waitlist Option */}
              {onJoinWaitlist && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-start gap-2 mb-2">
                    <MdRocketLaunch
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                      size={16}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs">
                        Want to be notified?
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Join the waitlist and be the first to know when we
                        launch in {requestedCity}!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onJoinWaitlist();
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-xs"
                  >
                    Join Waitlist for {requestedCity}
                  </button>
                </div>
              )}

              {/* Footer Note */}
              <div className="text-center pt-2">
                <p className="text-gray-500 text-xs">
                  {
                    "We're constantly expanding to new cities. Thank you for your patience! 💖"
                  }
                </p>
              </div>
            </div>

            {/* Fixed Action Buttons at Bottom */}
            <div className="flex-shrink-0 p-4 space-y-2 border-t border-gray-100 bg-white">
              {onChangeAddress && (
                <button
                  onClick={() => {
                    onClose();
                    onChangeAddress();
                  }}
                  className="w-full bg-[#CC2B52] text-white py-2.5 rounded-lg font-semibold hover:bg-[#B02547] transition-colors duration-200 text-sm"
                >
                  Change to Serviceable Address
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                Cancel Booking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CityServiceabilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  requestedCity: PropTypes.string.isRequired,
  requestedPincode: PropTypes.string,
  validationType: PropTypes.oneOf(["city", "pincode"]),
  serviceableCities: PropTypes.arrayOf(PropTypes.string),
  serviceablePincodes: PropTypes.arrayOf(PropTypes.string),
  onChangeAddress: PropTypes.func,
  onJoinWaitlist: PropTypes.func,
};

export default CityServiceabilityModal;
