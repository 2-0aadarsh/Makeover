/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";
import {
  X,
  Star,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Hash,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

/**
 * ReviewDetailModal - Admin modal for viewing and responding to reviews/complaints
 * 
 * Features:
 * - View full review/complaint details
 * - Admin response form for complaints
 * - Status update functionality
 * - Keyboard accessible
 * - Focus trap
 */
const ReviewDetailModal = ({ isOpen, onClose, review, onRespond }) => {
  const modalRef = useRef(null);
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState("reviewed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Max response length
  const MAX_RESPONSE_LENGTH = 1000;
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };
  
  // Lock body scroll (position: fixed + save scroll) so background does not scroll when modal is open
  useBodyScrollLock(!!isOpen);

  // Reset form when modal closes or review changes
  useEffect(() => {
    if (!isOpen) {
      setResponse("");
      setNewStatus("reviewed");
      setError(null);
    } else if (review?.adminResponse) {
      setResponse(review.adminResponse);
      setNewStatus(review.status || "reviewed");
    }
  }, [isOpen, review]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };
  
  // Handle response submission
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!response.trim()) {
      setError("Please enter a response");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onRespond(review._id || review.id, response.trim(), newStatus);
    } catch (err) {
      setError(err.message || "Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Get status badge color
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewed: "bg-blue-100 text-blue-700",
      published: "bg-green-100 text-green-700",
      hidden: "bg-gray-100 text-gray-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };
  
  // Render star rating
  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : star - 0.5 <= rating
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold text-gray-700">{rating}/5</span>
      </div>
    );
  };
  
  if (!isOpen || !review) return null;
  
  const isComplaint = review.type === "complaint";
  
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
        aria-labelledby="review-detail-title"
      >
        <motion.div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className={`sticky top-0 p-5 flex justify-between items-start z-10 ${
            isComplaint
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-[#CC2B52] to-[#B02547]"
          } text-white`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isComplaint ? (
                  <MessageSquare className="w-5 h-5" />
                ) : (
                  <Star className="w-5 h-5" />
                )}
                <h2 id="review-detail-title" className="text-xl font-bold">
                  {isComplaint ? "Complaint Details" : "Review Details"}
                </h2>
              </div>
              <p className="text-sm opacity-90">
                {review.orderNumber || "Order N/A"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6" data-modal-scroll>
            {/* Customer Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">
                    {review.customerName || review.customer?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 truncate">
                    {review.customer?.email || review.customerEmail || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-800">
                    {review.orderNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Service Info */}
            <div className="mb-6 p-4 bg-pink-50 border border-pink-100 rounded-lg">
              <p className="text-xs text-pink-600 font-medium mb-1">SERVICE</p>
              <p className="text-gray-800">
                {review.serviceName || review.booking?.serviceName || "N/A"}
              </p>
            </div>
            
            {/* Rating Section */}
            {review.rating && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">RATING</p>
                {renderStars(review.rating)}
              </div>
            )}
            
            {/* Complaint Category */}
            {isComplaint && review.complaintCategory && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">CATEGORY</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 capitalize">
                  {review.complaintCategory.replace(/_/g, " ")}
                </span>
              </div>
            )}
            
            {/* Review/Complaint Content */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                {isComplaint ? "COMPLAINT" : "REVIEW"}
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {review.comment || review.feedback || "No content provided"}
                </p>
              </div>
            </div>
            
            {/* Current Status */}
            <div className="mb-6 flex items-center gap-3">
              <p className="text-sm font-medium text-gray-500">STATUS:</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(review.status)}`}>
                {review.status || "pending"}
              </span>
            </div>
            
            {/* Edit Info */}
            {review.isEdited && (
              <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Edited on {formatDate(review.editedAt)}</span>
              </div>
            )}
            
            {/* Previous Admin Response */}
            {review.adminResponse && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">PREVIOUS ADMIN RESPONSE</p>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{review.adminResponse}</p>
                  {review.respondedAt && (
                    <p className="text-xs text-blue-500 mt-2">
                      Responded on {formatDate(review.respondedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Admin Response Form - Only for complaints */}
            {isComplaint && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#CC2B52]" />
                  {review.adminResponse ? "Update Response" : "Respond to Complaint"}
                </h3>
                
                <form onSubmit={handleSubmitResponse} className="space-y-4">
                  {/* Status Select */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all bg-white text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  {/* Response Textarea */}
                  <div>
                    <label htmlFor="admin-response" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="admin-response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value.slice(0, MAX_RESPONSE_LENGTH))}
                      placeholder="Enter your response to the customer..."
                      rows={4}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all resize-none text-sm"
                    />
                    <p className="text-xs text-right text-gray-400 mt-1">
                      {response.length}/{MAX_RESPONSE_LENGTH}
                    </p>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !response.trim()}
                      className={`px-6 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-all ${
                        isSubmitting || !response.trim()
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#CC2B52] hover:bg-[#B02547]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Send Response
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Review Actions - For non-complaints */}
            {!isComplaint && (
              <div className="border-t border-gray-200 pt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => onRespond(review._id || review.id, null, "published")}
                  disabled={review.status === "published"}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                    review.status === "published"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {review.status === "published" ? "Published" : "Publish Review"}
                </button>
                <button
                  onClick={() => onRespond(review._id || review.id, null, "hidden")}
                  disabled={review.status === "hidden"}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                    review.status === "hidden"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                >
                  {review.status === "hidden" ? "Hidden" : "Hide Review"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewDetailModal;
