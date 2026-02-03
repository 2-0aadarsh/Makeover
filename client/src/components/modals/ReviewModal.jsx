/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import {
  X,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";

import StarRating from "../ui/StarRating";
import Select from "../ui/Select";
import {
  submitReview,
  resetSubmission,
  selectSubmission,
} from "../../features/reviews/reviewsSlice";
import {
  fetchReviewRequests,
  fetchUnreadCount,
  hideReviewToast,
} from "../../features/notifications/notificationsSlice";

/**
 * ReviewModal Component
 * 
 * A modal for submitting reviews directly from the My Bookings page.
 * 
 * Features:
 * - Tab switching between Review and Complaint
 * - Star rating with half-star support
 * - Character counter
 * - Loading, success, and error states
 * - Keyboard accessible
 * - Focus trap
 */
const ReviewModal = ({ isOpen, onClose, booking }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  
  // Redux state
  const { loading, error, success } = useSelector(selectSubmission);
  
  // Local form state
  const [activeTab, setActiveTab] = useState("review");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("");
  
  // Character limit
  const MAX_COMMENT_LENGTH = 2000;
  
  // Complaint categories
  const complaintCategories = [
    { value: "service_quality", label: "Service Quality" },
    { value: "staff_behavior", label: "Staff Behavior" },
    { value: "timing", label: "Timing/Punctuality" },
    { value: "pricing", label: "Pricing Issues" },
    { value: "hygiene", label: "Hygiene Concerns" },
    { value: "other", label: "Other" },
  ];
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
  };
  
  useBodyScrollLock(!!isOpen);
  useEffect(() => {
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 100);
  }, [isOpen]);
  
  // Reset form and state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("review");
      setRating(0);
      setComment("");
      setComplaintCategory("");
      dispatch(resetSubmission());
    }
  }, [isOpen, dispatch]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, loading, onClose]);
  
  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };
  
  // Form validation
  const isFormValid = () => {
    if (activeTab === "review") {
      return rating >= 0.5;
    }
    return comment.trim().length > 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid() || !booking) return;
    
    const reviewData = {
      bookingId: booking._id,
      type: activeTab,
      rating: activeTab === "review" ? rating : null,
      comment: comment.trim(),
      complaintCategory: activeTab === "complaint" ? complaintCategory : null,
      source: "web",
    };
    
    dispatch(submitReview(reviewData));
  };
  
  // Auto-close on success after delay and refresh notifications
  useEffect(() => {
    if (success) {
      // Refresh notifications to update counts
      dispatch(fetchReviewRequests());
      dispatch(fetchUnreadCount());
      dispatch(hideReviewToast());
      
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, onClose, dispatch]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  
  // Get service names
  const getServiceNames = (services) => {
    if (!services || !Array.isArray(services)) return "";
    return services.map((s) => s.name || s.serviceName).join(", ");
  };
  
  if (!isOpen) return null;
  
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
        aria-labelledby="review-modal-title"
      >
        <motion.div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#CC2B52] to-[#B02547] text-white p-5 flex justify-between items-start z-10">
            <div>
              <h2 id="review-modal-title" className="text-xl font-bold">
                Share Your Feedback
              </h2>
              {booking && (
                <p className="text-sm opacity-90 mt-1">
                  Order #{booking.orderNumber}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab === "review" ? "Thank You!" : "Complaint Submitted"}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "review"
                    ? "Your review has been submitted successfully."
                    : "We'll review your complaint and get back to you."}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Booking Info */}
                {booking && (
                  <div className="px-5 pt-5">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-800">
                        {getServiceNames(booking.services)}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(booking.bookingDetails?.date)}</span>
                        {booking.bookingDetails?.slot && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{booking.bookingDetails.slot}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tab Switcher */}
                <div className="flex border-b border-gray-100 mx-5 mt-4">
                  <button
                    ref={firstInputRef}
                    onClick={() => setActiveTab("review")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === "review"
                        ? "text-[#CC2B52]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Star className="w-4 h-4" />
                      Review
                    </span>
                    {activeTab === "review" && (
                      <motion.div
                        layoutId="activeReviewTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("complaint")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === "complaint"
                        ? "text-[#CC2B52]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Complaint
                    </span>
                    {activeTab === "complaint" && (
                      <motion.div
                        layoutId="activeReviewTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]"
                      />
                    )}
                  </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                  <AnimatePresence mode="wait">
                    {activeTab === "review" ? (
                      <motion.div
                        key="review"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-5"
                      >
                        {/* Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Your Rating <span className="text-red-500">*</span>
                          </label>
                          <div className="flex justify-center py-4 bg-gray-50 rounded-xl">
                            <StarRating
                              value={rating}
                              onChange={setRating}
                              size="lg"
                              showValue
                            />
                          </div>
                        </div>
                        
                        {/* Comment */}
                        <div>
                          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review (optional)
                          </label>
                          <textarea
                            id="review-text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                            placeholder="Tell us about your experience..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all resize-none text-sm"
                          />
                          <p className="text-xs text-right text-gray-400 mt-1">
                            {comment.length}/{MAX_COMMENT_LENGTH}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="complaint"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        {/* Category */}
                        <div>
                          <Select
                            label="Category"
                            value={complaintCategory}
                            onChange={(e) => setComplaintCategory(e.target.value)}
                            options={complaintCategories}
                            placeholder="Select a category"
                            labelClassName="text-sm font-medium text-gray-700"
                            height="44px"
                          />
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="complaint-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="complaint-text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                            placeholder="Please describe your issue in detail..."
                            rows={4}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all resize-none text-sm"
                          />
                          <p className="text-xs text-right text-gray-400 mt-1">
                            {comment.length}/{MAX_COMMENT_LENGTH}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                      loading || !isFormValid()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#CC2B52] hover:bg-[#B02547]"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : activeTab === "review" ? (
                      "Submit Review"
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
