import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  MessageSquare,
  AlertCircle,
  Loader2,
  Edit2,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

import {
  fetchMyReviews,
  selectMyReviews,
} from "../features/reviews/reviewsSlice";
import StarRating from "../components/ui/StarRating";
import EditReviewModal from "../components/modals/EditReviewModal";

/**
 * MyReviewsPage Component
 * 
 * Displays all reviews and complaints submitted by the current user.
 * 
 * Features:
 * - List of all submitted reviews/complaints
 * - Filter by type (All, Reviews, Complaints)
 * - Display rating, comment, service name, date
 * - Show status (reviewed, pending, resolved)
 * - Show admin response for complaints
 * - Edit button for reviews within edit window
 */
const MyReviewsPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    loading,
    error,
    reviews,
    pagination,
  } = useSelector(selectMyReviews);
  
  // Local state
  const [filter, setFilter] = useState("all"); // all, review, complaint
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch reviews on mount
  useEffect(() => {
    dispatch(fetchMyReviews({ page: 1, limit: 20 }));
  }, [dispatch]);
  
  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.type === filter;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format complaint category for display (e.g. staff_behavior → Staff behavior)
  const formatComplaintCategory = (category) => {
    if (!category) return "";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      reviewed: {
        label: "Reviewed",
        icon: CheckCircle,
        className: "bg-green-100 text-green-700",
      },
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700",
      },
      resolved: {
        label: "Resolved",
        icon: CheckCircle,
        className: "bg-blue-100 text-blue-700",
      },
      rejected: {
        label: "Rejected",
        icon: AlertCircle,
        className: "bg-red-100 text-red-700",
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };
  
  // Get type badge
  const getTypeBadge = (type) => {
    return type === "review" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
        <Star className="w-3.5 h-3.5" />
        Review
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
        <AlertCircle className="w-3.5 h-3.5" />
        Complaint
      </span>
    );
  };
  
  // Check if review can be edited
  const canEdit = (review) => {
    if (review.type !== "review") return false;
    const expiryDate = new Date(review.editWindowExpiresAt);
    return new Date() < expiryDate;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews & Complaints</h1>
          <p className="text-gray-600">View all your submitted reviews and track complaint responses</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
            
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#CC2B52] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({reviews.length})
            </button>
            
            <button
              onClick={() => setFilter("review")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "review"
                  ? "bg-[#CC2B52] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Reviews ({reviews.filter((r) => r.type === "review").length})
            </button>
            
            <button
              onClick={() => setFilter("complaint")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "complaint"
                  ? "bg-[#CC2B52] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Complaints ({reviews.filter((r) => r.type === "complaint").length})
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#CC2B52] animate-spin" />
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Reviews</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchMyReviews({ page: 1, limit: 20 }))}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "all" ? "No Reviews Yet" : `No ${filter === "review" ? "Reviews" : "Complaints"} Yet`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't submitted any reviews or complaints yet."
                : `You haven't submitted any ${filter === "review" ? "reviews" : "complaints"} yet.`}
            </p>
          </div>
        )}
        
        {/* Reviews List */}
        {!loading && !error && filteredReviews.length > 0 && (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeBadge(review.type)}
                      {getStatusBadge(review.status)}
                      {review.isEdited && (
                        <span className="text-xs text-gray-500 italic">
                          (Edited)
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {review.serviceName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(review.createdAt)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>Order #{review.orderNumber}</span>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  {canEdit(review) && (
                    <button
                      type="button"
                      onClick={() => {
                        setReviewToEdit(review);
                        setIsEditModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#CC2B52] hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                
                {/* Rating (for reviews) */}
                {review.type === "review" && review.rating && (
                  <div className="mb-4">
                    <StarRating value={review.rating} readOnly size="md" />
                  </div>
                )}
                
                {/* Your complaint / Your review – labeled section */}
                {review.type === "complaint" && review.complaintCategory && (
                  <div className="mb-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Category
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                      {formatComplaintCategory(review.complaintCategory)}
                    </p>
                  </div>
                )}
                
                {review.comment && (
                  <div className="mb-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {review.type === "complaint" ? "Your complaint" : "Your feedback"}
                    </span>
                    <p className="mt-1.5 text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  </div>
                )}
                
                {/* Admin Response – improved card */}
                {review.adminResponse && (
                  <div className="mt-6 pt-5 border-t border-gray-200">
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white overflow-hidden shadow-sm">
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#CC2B52]/5 border-b border-gray-100">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#CC2B52]/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-[#CC2B52]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Response from our team
                          </h4>
                          {review.respondedAt && (
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(review.respondedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {review.adminResponse}
                        </p>
                        <p className="mt-4 text-xs text-gray-500">
                          Need more help? Contact us from the Contact Us page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Edit Window Info */}
                {review.type === "review" && canEdit(review) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      You can edit this review until {formatDate(review.editWindowExpiresAt)}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Edit Review Modal */}
        <EditReviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setReviewToEdit(null);
          }}
          review={reviewToEdit}
        />

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => dispatch(fetchMyReviews({ page: pagination.currentPage - 1, limit: 20 }))}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => dispatch(fetchMyReviews({ page: pagination.currentPage + 1, limit: 20 }))}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
