/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

import StarRating from "../ui/StarRating";
import {
  editReview,
  resetEditing,
  fetchMyReviews,
  selectEditing,
} from "../../features/reviews/reviewsSlice";

const MAX_COMMENT_LENGTH = 2000;

/**
 * EditReviewModal – Edit an existing review (rating + comment) within the edit window.
 */
const EditReviewModal = ({ isOpen, onClose, review }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(selectEditing);

  const [rating, setRating] = useState(review?.rating ?? 0);
  const [comment, setComment] = useState(review?.comment ?? "");

  useEffect(() => {
    if (review) {
      setRating(review.rating ?? 0);
      setComment(review.comment ?? "");
    }
  }, [review]);

  useEffect(() => {
    if (success) {
      toast.success("Review updated successfully");
      dispatch(resetEditing());
      dispatch(fetchMyReviews({ page: 1, limit: 20 }));
      onClose();
    }
  }, [success, dispatch, onClose]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!review?._id) return;
    const updates = {};
    if (rating !== undefined && rating !== null) updates.rating = rating;
    if (comment !== undefined) updates.comment = comment.trim();
    if (Object.keys(updates).length === 0) {
      toast.error("Please change rating or comment to save");
      return;
    }
    dispatch(editReview({ reviewId: review._id, updates }));
  };

  const handleClose = () => {
    if (!loading) {
      dispatch(resetEditing());
      onClose();
    }
  };

  useBodyScrollLock(!!isOpen);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden overscroll-contain"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Edit your review</h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto flex-1" data-modal-scroll>
            {review?.serviceName && (
              <p className="text-sm text-gray-600 mb-4">{review.serviceName}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  readOnly={false}
                  size="lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] resize-none"
                  placeholder="Share your experience..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length} / {MAX_COMMENT_LENGTH}
                </p>
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#CC2B52] text-white rounded-lg hover:bg-[#CC2B52]/90 font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditReviewModal;
