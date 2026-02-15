/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ArrowRight } from "lucide-react";

import {
  fetchReviewRequests,
  hideReviewToast,
  dismissToast,
  selectReviewRequests,
  selectShowReviewToast,
} from "../../features/notifications/notificationsSlice";

/**
 * ReviewToast Component
 * 
 * A toast notification that appears when the user has pending reviews.
 * 
 * Features:
 * - Non-blocking toast in top-right corner
 * - Auto-dismiss after 8 seconds
 * - Manual close option
 * - Dismiss permanently (for session)
 * - Animated entrance/exit
 * - Accessible (ARIA-friendly)
 */
const ReviewToast = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { notifications: reviewRequests, count } = useSelector(selectReviewRequests);
  const showToast = useSelector(selectShowReviewToast);
  
  // Fetch review requests on mount (for logged in users)
  useEffect(() => {
    dispatch(fetchReviewRequests());
  }, [dispatch]);
  
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        dispatch(hideReviewToast());
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showToast, dispatch]);
  
  // Handle click to navigate to bookings
  const handleClick = () => {
    navigate("/my-bookings");
    dispatch(hideReviewToast());
  };
  
  // Handle close (hide temporarily)
  const handleClose = (e) => {
    e.stopPropagation();
    dispatch(hideReviewToast());
  };
  
  // Handle dismiss (hide for session)
  const handleDismiss = (e) => {
    e.stopPropagation();
    dispatch(dismissToast());
  };
  
  return (
    <AnimatePresence>
      {showToast && count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-full sm:w-auto"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            onClick={handleClick}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-[#CC2B52] to-pink-400"
            />
            
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Share your feedback!
                    </h4>
                    <button
                      onClick={handleClose}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 flex-shrink-0"
                      aria-label="Close notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    You have {count} {count === 1 ? "booking" : "bookings"} awaiting your review.
                  </p>
                  
                  {/* First review request preview */}
                  {reviewRequests[0] && (
                    <p className="text-xs text-gray-400 mt-1.5 truncate">
                      {reviewRequests[0].serviceName || reviewRequests[0].orderNumber}
                    </p>
                  )}
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={handleDismiss}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Don't show again
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#CC2B52]">
                      Review now
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * ToastContainer Component
 * 
 * A container for managing multiple toasts.
 * Can be extended to support stackable toasts.
 */
export const ToastContainer = ({ children }) => {
  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default ReviewToast;
