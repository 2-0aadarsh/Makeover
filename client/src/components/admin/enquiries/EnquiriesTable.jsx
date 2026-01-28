/* eslint-disable react/prop-types */

/**
 * EnquiriesTable - Table component for displaying all enquiries
 * Matches Figma design specifications
 */
const EnquiriesTable = ({ enquiries = [] }) => {
  if (enquiries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No enquiries found
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
                City
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
                Enquiry Generated For
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enquiries.map((enquiry, index) => (
              <tr
                key={enquiry.id || index}
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
                  {enquiry.customerName || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {enquiry.city || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {enquiry.phoneNumber
                    ? enquiry.phoneNumber.startsWith("+91")
                      ? enquiry.phoneNumber
                      : `(+91) ${enquiry.phoneNumber}`
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
                  {enquiry.email || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {enquiry.enquiryGeneratedFor || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiriesTable;
