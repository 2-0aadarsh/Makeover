/* eslint-disable react/prop-types */

const EMPTY_MESSAGES = {
  today: "No bookings found for today",
  tomorrow: "No bookings found for tomorrow",
  week: "No bookings found for this week",
};

/**
 * TodaysBookingTable - Table component for displaying period bookings (today/tomorrow/week)
 *
 * @param {Array} bookings - Array of booking objects
 * @param {Function} onPageChange - Callback for pagination
 * @param {Object} pagination - Pagination info { currentPage, totalPages, totalBookings, limit }
 * @param {string} period - 'today' | 'tomorrow' | 'week' for empty state message
 */
const TodaysBookingTable = ({ bookings = [], onPageChange, pagination, period = 'today' }) => {
  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        text: "Completed",
        className: "bg-green-500 text-white",
      },
      pending: {
        text: "Pending",
        className: "bg-yellow-500 text-white",
      },
      confirmed: {
        text: "Confirmed",
        className: "bg-blue-500 text-white",
      },
      cancelled: {
        text: "Cancelled",
        className: "bg-red-500 text-white",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">{EMPTY_MESSAGES[period] || EMPTY_MESSAGES.today}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr key={booking.bookingId || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.customerName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {booking.bookingId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {booking.phoneNumber || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {booking.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {booking.dateTime || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing data {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalBookings)} of{" "}
              {pagination.totalBookings.toLocaleString()} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1 text-sm rounded ${
                  pagination.hasPrevPage
                    ? "text-gray-700 hover:bg-gray-200"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                &lt;
              </button>
              {[...Array(Math.min(4, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === pagination.currentPage
                        ? "bg-[#CC2B52] text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 4 && (
                <>
                  <span className="text-gray-400">...</span>
                  <button
                    onClick={() => onPageChange(pagination.totalPages)}
                    className={`px-3 py-1 text-sm rounded ${
                      pagination.totalPages === pagination.currentPage
                        ? "bg-[#CC2B52] text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1 text-sm rounded ${
                  pagination.hasNextPage
                    ? "text-gray-700 hover:bg-gray-200"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysBookingTable;
