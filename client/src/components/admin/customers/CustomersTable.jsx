/* eslint-disable react/prop-types */

/**
 * CustomersTable - Table component for displaying all customers
 * Matches Figma design specifications
 */
const CustomersTable = ({ customers = [], onCustomerClick }) => {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm  p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No customers found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm  overflow-hidden">
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr
                key={customer.id || index}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onCustomerClick && onCustomerClick(customer)}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {customer.name || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {customer.city || "N/A"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#292D32',
                  }}
                >
                  {customer.phoneNumber
                    ? customer.phoneNumber.startsWith("+91")
                      ? customer.phoneNumber
                      : `(+91) ${customer.phoneNumber}`
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
                  {customer.email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTable;
