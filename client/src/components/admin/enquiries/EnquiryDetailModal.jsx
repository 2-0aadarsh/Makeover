/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  MapPin,
  Briefcase,
} from "lucide-react";

/**
 * EnquiryDetailModal - Read-only modal to view full enquiry details including message
 * Matches app modal pattern (ReviewDetailModal style)
 */
const EnquiryDetailModal = ({ isOpen, onClose, enquiry }) => {
  useBodyScrollLock(!!isOpen);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPreferredDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const phoneDisplay =
    enquiry?.phoneNumber &&
    (enquiry.phoneNumber.startsWith("+91")
      ? enquiry.phoneNumber
      : `(+91) ${enquiry.phoneNumber}`);

  if (!isOpen || !enquiry) return null;

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const hasMessage = enquiry.message && String(enquiry.message).trim();

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden overscroll-contain"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-detail-title"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="sticky top-0 p-5 flex justify-between items-start z-10 bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <h2 id="enquiry-detail-title" className="text-xl font-bold">
                Enquiry details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="overflow-y-auto max-h-[calc(90vh-80px)] p-6"
            data-modal-scroll
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Customer name</p>
                  <p className="font-medium text-gray-800 truncate">
                    {enquiry.customerName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium text-gray-800">
                    {enquiry.city || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {phoneDisplay || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 truncate">
                    {enquiry.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-pink-50 border border-pink-100 rounded-lg">
              <p className="text-xs text-pink-600 font-medium mb-1">
                Enquiry generated for
              </p>
              <p className="text-gray-800 font-medium">
                {enquiry.enquiryGeneratedFor || "N/A"}
              </p>
              {enquiry.serviceCategory && (
                <p className="text-sm text-gray-600 mt-1">
                  {enquiry.serviceCategory}
                </p>
              )}
            </div>

            {(enquiry.preferredDate || enquiry.preferredTimeSlot) && (
              <div className="mb-6 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  {enquiry.preferredDate && (
                    <p className="text-sm text-gray-800">
                      Preferred date: {formatPreferredDate(enquiry.preferredDate)}
                    </p>
                  )}
                  {enquiry.preferredTimeSlot && (
                    <p className="text-sm text-gray-800">
                      Preferred time: {enquiry.preferredTimeSlot}
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasMessage && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Customer message
                </p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-48 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {enquiry.message}
                  </p>
                </div>
              </div>
            )}

            {!hasMessage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  No message provided with this enquiry.
                </p>
              </div>
            )}

            {enquiry.createdAt && (
              <div className="mb-6 text-sm text-gray-500">
                Submitted on {formatDate(enquiry.createdAt)}
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryDetailModal;
