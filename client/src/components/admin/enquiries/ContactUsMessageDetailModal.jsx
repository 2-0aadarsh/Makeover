/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import { X, User, Mail, Phone, Calendar, MessageSquare } from "lucide-react";

/**
 * ContactUsMessageDetailModal - Read-only modal to view full Contact Us message
 * Matches app modal pattern (ReviewDetailModal style)
 */
const ContactUsMessageDetailModal = ({ isOpen, onClose, message: msg }) => {
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
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800",
      reviewed: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  if (!isOpen || !msg) return null;

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

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
        aria-labelledby="contact-message-detail-title"
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
              <MessageSquare className="w-5 h-5" />
              <h2 id="contact-message-detail-title" className="text-xl font-bold">
                Contact message
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
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800 truncate">
                    {msg.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 truncate">
                    {msg.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {msg.phoneNumber || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                  msg.status
                )}`}
              >
                {msg.status || "pending"}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-60 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {msg.message || "No message"}
                </p>
              </div>
            </div>

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

export default ContactUsMessageDetailModal;
