import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Calendar,
  Clock,
  ArrowLeft,
  Send,
} from "lucide-react";

import StarRating from "../../components/ui/StarRating";
import Select from "../../components/ui/Select";
import {
  verifyReviewToken,
  submitReview,
  resetTokenVerification,
  resetSubmission,
  selectTokenVerification,
  selectSubmission,
} from "../../features/reviews/reviewsSlice";
import {
  fetchReviewRequests,
  fetchUnreadCount,
  hideReviewToast,
} from "../../features/notifications/notificationsSlice";

/**
 * SubmitReviewPage
 * 
 * A clean, focused page for users to submit reviews or complaints
 * after their booking is completed/cancelled/no_show.
 * 
 * Features:
 * - Token verification from email link
 * - Two tabs: Review / Complaint
 * - Star rating with half-star support
 * - Character counter for text input
 * - Loading, success, and error states
 * - Mobile-first responsive design
 */
const SubmitReviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get token and type from URL
  const token = searchParams.get("token");
  const initialType = searchParams.get("type") || "review";
  
  // Redux state
  const { loading: verifying, error: verifyError, bookingData, isValid } = useSelector(selectTokenVerification);
  const { loading: submitting, error: submitError, success, data: submissionData } = useSelector(selectSubmission);
  
  // Local form state
  const [activeTab, setActiveTab] = useState(initialType);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("");
  
  // Character limits
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
  
  // Verify token on mount
  useEffect(() => {
    if (token) {
      dispatch(verifyReviewToken(token));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(resetTokenVerification());
      dispatch(resetSubmission());
    };
  }, [token, dispatch]);
  
  // Update active tab from URL
  useEffect(() => {
    if (initialType === "complaint") {
      setActiveTab("complaint");
    }
  }, [initialType]);
  
  // Refresh notifications after successful review submission
  useEffect(() => {
    if (success) {
      // Refetch review requests and unread count to update the toast and bell
      dispatch(fetchReviewRequests());
      dispatch(fetchUnreadCount());
      dispatch(hideReviewToast());
    }
  }, [success, dispatch]);
  
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
    
    if (!isFormValid()) return;
    
    const reviewData = {
      token,
      type: activeTab,
      rating: activeTab === "review" ? rating : null,
      comment: comment.trim(),
      complaintCategory: activeTab === "complaint" ? complaintCategory : null,
      source: "email",
    };
    
    dispatch(submitReview(reviewData));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  // Render loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full"
        >
          <Loader2 className="w-12 h-12 text-[#CC2B52] mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying your link...</h2>
          <p className="text-gray-500">Please wait while we verify your review link.</p>
        </motion.div>
      </div>
    );
  }
  
  // Render error state (invalid token)
  if (verifyError || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-500 mb-6">
            {verifyError || "This review link is invalid or has expired. Please check your email for a valid link or contact support."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CC2B52] text-white rounded-xl font-medium hover:bg-[#B02547] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }
  
  // Render success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {activeTab === "review" ? "Thank You for Your Review!" : "Complaint Submitted"}
          </h2>
          <p className="text-gray-500 mb-6">
            {activeTab === "review"
              ? "Your feedback helps us improve and serve you better. We truly appreciate you taking the time to share your experience!"
              : "We've received your complaint and will review it shortly. Our team will get back to you if needed."}
          </p>
          {submissionData?.editWindowExpiresAt && activeTab === "review" && (
            <p className="text-sm text-gray-400 mb-6">
              You can edit your review within 48 hours if needed.
            </p>
          )}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#CC2B52] text-white rounded-xl font-medium hover:bg-[#B02547] transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }
  
  // Main form render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Share Your Experience</h1>
          <p className="text-gray-500">Your feedback helps us improve our services</p>
        </motion.div>
        
        {/* Booking Summary Card */}
        {bookingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-[#CC2B52] uppercase tracking-wide mb-4">
              Booking Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-sm font-medium text-gray-500 w-24">Order:</span>
                <span className="font-semibold text-gray-800">{bookingData.orderNumber}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <span className="text-sm font-medium text-gray-500 w-24">Services:</span>
                <span className="text-gray-800">
                  {bookingData.services?.map((s) => s.name).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(bookingData.bookingDate)}</span>
              </div>
              {bookingData.bookingSlot && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{bookingData.bookingSlot}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("review")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all relative ${
                activeTab === "review"
                  ? "text-[#CC2B52] bg-pink-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                Leave a Review
              </span>
              {activeTab === "review" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("complaint")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all relative ${
                activeTab === "complaint"
                  ? "text-[#CC2B52] bg-pink-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                File a Complaint
              </span>
              {activeTab === "complaint" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC2B52]"
                />
              )}
            </button>
          </div>
          
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "review" ? (
                <motion.div
                  key="review-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Rating Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How would you rate your experience? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col items-center gap-3 py-4 bg-gray-50 rounded-xl">
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size="xl"
                        showValue
                      />
                      <p className="text-sm text-gray-500">
                        {rating === 0
                          ? "Click to rate"
                          : rating <= 2
                          ? "We're sorry to hear that"
                          : rating <= 3.5
                          ? "Thanks for the feedback"
                          : "We're glad you enjoyed it!"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Comment Section */}
                  <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us more about your experience (optional)
                    </label>
                    <textarea
                      id="review-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                      placeholder="What did you like or dislike? Any suggestions for improvement?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all resize-none"
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${comment.length > MAX_COMMENT_LENGTH * 0.9 ? "text-orange-500" : "text-gray-400"}`}>
                        {comment.length}/{MAX_COMMENT_LENGTH}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="complaint-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Complaint Category */}
                  <div>
                    <Select
                      label="What is your complaint about?"
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      options={complaintCategories}
                      placeholder="Select a category"
                      labelClassName="text-sm font-medium text-gray-700"
                    />
                  </div>
                  
                  {/* Complaint Description */}
                  <div>
                    <label htmlFor="complaint-description" className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your complaint <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="complaint-description"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                      placeholder="Please provide details about your issue so we can address it properly..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] outline-none transition-all resize-none"
                      required
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${comment.length > MAX_COMMENT_LENGTH * 0.9 ? "text-orange-500" : "text-gray-400"}`}>
                        {comment.length}/{MAX_COMMENT_LENGTH}
                      </span>
                    </div>
                  </div>
                  
                  {/* Optional Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate your overall experience (optional)
                    </label>
                    <StarRating
                      value={rating}
                      onChange={setRating}
                      size="lg"
                      showValue
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error Message */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </motion.div>
            )}
            
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting || !isFormValid()}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  submitting || !isFormValid()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#CC2B52] hover:bg-[#B02547] shadow-lg hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {activeTab === "review" ? "Submit Review" : "Submit Complaint"}
                  </>
                )}
              </button>
            </div>
            
            {/* Privacy Note */}
            <p className="mt-4 text-xs text-center text-gray-400">
              Your feedback is valuable to us. All submissions are reviewed by our team.
              {activeTab === "review" && " You can edit your review within 48 hours."}
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
