/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

/**
 * BookingsTable - Table component for displaying all bookings
 * Matches Figma design specifications
 */
const BookingsTable = ({ bookings = [], onBookingClick }) => {
  const navigate = useNavigate();

  const handleBookingClick = (booking) => {
    if (onBookingClick) {
      onBookingClick(booking);
    } else {
      // Default: navigate to booking details page
      navigate(`/admin/bookings/${booking.id || booking.bookingId}`);
    }
  };
  // Status badge component matching Figma colors
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
      in_progress: {
        text: "In Progress",
        className: "bg-blue-400 text-white",
      },
      no_show: {
        text: "No Show",
        className: "bg-orange-500 text-white",
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

  const getPaymentStatusBadge = (paymentStatus) => {
    const configMap = {
      completed: { text: "Paid", className: "bg-green-500 text-white" },
      pending: { text: "Pending", className: "bg-amber-500 text-white" },
      processing: { text: "Processing", className: "bg-blue-500 text-white" },
      failed: { text: "Failed", className: "bg-red-500 text-white" },
      refunded: { text: "Refunded", className: "bg-gray-500 text-white" },
    };
    const config = configMap[paymentStatus?.toLowerCase()] || configMap.pending;
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
      <div className="bg-white rounded-lg shadow-sm  p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No bookings found
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
                  color: '#CC2B52',
                }}
              >
                Booking ID
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Phone Number
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                }}
              >
                Date & Time
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                  textAlign: 'left',
                }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#CC2B52',
                  textAlign: 'right',
                }}
              >
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr
                key={booking.id || booking.bookingId || index}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleBookingClick(booking)}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {booking.customerName || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800 font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
                  {booking.bookingId || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {booking.phoneNumber
                    ? booking.phoneNumber.startsWith("+91")
                      ? booking.phoneNumber
                      : `(+91) ${booking.phoneNumber}`
                    : "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {booking.email || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {booking.dateTime || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
