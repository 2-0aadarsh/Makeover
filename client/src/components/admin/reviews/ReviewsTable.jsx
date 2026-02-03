/* eslint-disable react/prop-types */
import { Star, MessageSquare, Eye } from "lucide-react";

/**
 * ReviewsTable - Table component for displaying all reviews/complaints
 * Features:
 * - Clickable rows for detail view
 * - Type badges (review/complaint)
 * - Status badges
 * - Rating display with stars
 */
const ReviewsTable = ({ reviews = [], onReviewClick }) => {
  // Format rating display
  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return `${rating}/5`;
  };

  // Get rating badge color
  const getRatingBadgeColor = (rating) => {
    if (!rating) return "bg-gray-100 text-gray-600";
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewed: "bg-blue-100 text-blue-700",
      published: "bg-green-100 text-green-700",
      hidden: "bg-gray-100 text-gray-600",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-600";
  };

  // Get type badge styling
  const getTypeBadge = (type) => {
    if (type === "complaint") {
      return {
        className: "bg-red-50 text-red-600 border border-red-200",
        icon: <MessageSquare className="w-3 h-3" />,
        label: "Complaint",
      };
    }
    return {
      className: "bg-yellow-50 text-yellow-600 border border-yellow-200",
      icon: <Star className="w-3 h-3" />,
      label: "Review",
    };
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No reviews found
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Order/Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Comment
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reviews.map((review, index) => {
              const typeBadge = getTypeBadge(review.type);
              
              return (
                <tr
                  key={review.id || review._id || index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onReviewClick?.(review)}
                >
                  {/* Type Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeBadge.className}`}>
                      {typeBadge.icon}
                      {typeBadge.label}
                    </span>
                  </td>
                  
                  {/* Customer */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {review.customerName || review.customer?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.customer?.email || review.customerEmail || ""}
                      </p>
                    </div>
                  </td>
                  
                  {/* Order/Service */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {review.orderNumber || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {review.serviceName || review.booking?.serviceName || review.service?.name || ""}
                      </p>
                    </div>
                  </td>
                  
                  {/* Rating */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {review.rating ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getRatingBadgeColor(review.rating)}`}>
                        <Star className="w-3 h-3 fill-current" />
                        {formatRating(review.rating)}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  
                  {/* Comment */}
                  <td className="px-4 py-4 max-w-[200px]">
                    <p className="text-sm text-gray-600 truncate" title={review.comment || review.feedback || "No comment"}>
                      {review.comment || review.feedback || "No comment"}
                    </p>
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(review.status)}`}>
                      {review.status || "pending"}
                    </span>
                  </td>
                  
                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {review.createdAt || review.submittedAt
                      ? new Date(review.createdAt || review.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : "N/A"}
                  </td>
                  
                  {/* Action */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviewClick?.(review);
                      }}
                      className="p-2 text-gray-400 hover:text-[#CC2B52] hover:bg-pink-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
