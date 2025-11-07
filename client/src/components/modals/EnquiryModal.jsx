/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEnquiry from "../../hooks/useEnquiry";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";

/**
 * EnquiryModal Component
 *
 * A reusable modal for submitting service enquiries with enhanced UI/UX
 *
 * @param {Boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Handler for closing the modal
 * @param {Object} serviceData - Service details (serviceName, serviceCategory, priceRange, serviceId)
 * @param {String} source - Source of enquiry (e.g., "professional-makeup")
 */
const EnquiryModal = ({ isOpen, onClose, serviceData, source }) => {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const {
    formData,
    isSubmitting,
    successMessage,
    errorMessage,
    enquiryNumber,
    handleInputChange,
    submitEnquiry,
    resetMessages,
    isLoggedIn,
  } = useEnquiry();

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const modalVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.4,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const body = document.querySelector("body");
      body.style.overflowY = "hidden";

      // Focus first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      return () => {
        body.style.overflowY = "scroll";
      };
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submitEnquiry(serviceData, source);

    if (result.success) {
      // Auto-close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        resetMessages();
      }, 3000);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetMessages();
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="enquiry-modal-overlay"
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white p-5 rounded-t-2xl flex justify-between items-center z-10">
            <div className="flex-1">
              <h2 id="enquiry-modal-title" className="text-xl font-bold mb-1">
                Service Enquiry
              </h2>
              <p className="text-sm opacity-90 font-medium">
                {serviceData?.serviceName || "Get in touch with us"}
              </p>
            </div>
            <motion.button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                className="mx-5 mt-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-green-800 font-semibold">
                    Enquiry Submitted!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    {successMessage}
                  </p>
                  {enquiryNumber && (
                    <p className="text-green-600 text-xs mt-2 font-mono bg-green-100 inline-block px-2 py-1 rounded">
                      Reference: {enquiryNumber}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                className="mx-5 mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-red-800 font-semibold">Unable to Submit</p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Service Info Card */}
              <motion.div
                className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#CC2B52]" />
                  Service Details
                </h3>
                <div className="text-sm space-y-1.5">
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Service:</span>
                    <span className="text-gray-800 font-semibold">
                      {serviceData?.serviceName}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="text-gray-800">
                      {serviceData?.serviceCategory}
                    </span>
                  </p>
                  {serviceData?.priceRange && (
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">Price:</span>
                      <span className="text-gray-800 font-semibold">
                        ₹{serviceData.priceRange}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide text-[#CC2B52]">
                  Contact Information
                </h4>

                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting || isLoggedIn}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting || isLoggedIn}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isSubmitting || isLoggedIn}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide text-[#CC2B52]">
                  Preferences (Optional)
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {/* Preferred Date */}
                  <div className="relative">
                    <label
                      htmlFor="preferredDate"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="relative">
                    <label
                      htmlFor="preferredTimeSlot"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        id="preferredTimeSlot"
                        name="preferredTimeSlot"
                        value={formData.preferredTimeSlot}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
                      >
                        <option value="">Select a time slot</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Your Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows="3"
                  maxLength="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400"
                  placeholder="Tell us about your requirements, expectations, or any specific questions..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.message.length}/1000 characters
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !!successMessage}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white rounded-xl font-semibold hover:from-[#B02547] hover:to-[#991D3A] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : successMessage ? (
                    <>
                      <CheckCircle size={18} />
                      Submitted
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </motion.button>
              </motion.div>

              {/* Privacy Note */}
              <motion.p
                className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                By submitting this enquiry, you agree to be contacted via phone
                or email. We respect your privacy and will never share your
                information.
              </motion.p>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryModal;
