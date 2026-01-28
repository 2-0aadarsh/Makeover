/* eslint-disable react/prop-types */

/**
 * ReviewsTable - Table component for displaying all reviews/complaints
 * Matches Figma design specifications and consistent with EnquiriesTable
 */
const ReviewsTable = ({ reviews = [] }) => {
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

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No reviews found
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
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Customer Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#292D32',
                }}
              >
                Service/Booking
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Rating
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Review/Comment
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review, index) => (
              <tr
                key={review.id || review._id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {review.customerName || review.customer?.name || "N/A"}
                </td>
                <td
                  className="px-6 py-4 font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {review.serviceName || review.booking?.serviceName || review.service?.name || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {review.rating ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingBadgeColor(review.rating)}`}
                    >
                      {formatRating(review.rating)}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td
                  className="px-6 py-4 max-w-md font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  <div className="truncate" title={review.comment || review.feedback || "No comment"}>
                    {review.comment || review.feedback || "No comment"}
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {review.createdAt || review.submittedAt
                    ? new Date(review.createdAt || review.submittedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTable;
