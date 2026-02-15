/* eslint-disable react/prop-types */
import { useState } from "react";
import { Eye } from "lucide-react";
import ContactUsMessageDetailModal from "./ContactUsMessageDetailModal";

/**
 * ContactUsMessagesTable - Table for Contact Us form submissions
 * Columns: Name, Email, Phone, Message, Date, Status, Actions (View)
 */
const ContactUsMessagesTable = ({ messages = [] }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleView = (msg) => {
    setSelectedMessage(msg);
    setDetailOpen(true);
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500 font-sans" style={{ fontSize: '16px', fontWeight: 500 }}>
          No contact us messages found
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#CC2B52' }}
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#292D32' }}
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#CC2B52' }}
              >
                Phone
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#292D32' }}
              >
                Message
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#CC2B52' }}
              >
                Date
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#292D32' }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider font-sans"
                style={{ fontSize: '16px', fontWeight: 600, color: '#CC2B52' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                >
                  {msg.name || 'N/A'}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                >
                  {msg.email || 'N/A'}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                >
                  {msg.phoneNumber || '—'}
                </td>
                <td
                  className="px-6 py-4 font-sans max-w-xs truncate"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                  title={msg.message}
                >
                  {msg.message || '—'}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                >
                  {formatDate(msg.createdAt)}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap font-sans"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#292D32' }}
                >
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      msg.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : msg.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {msg.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleView(msg)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#CC2B52] border border-[#CC2B52] rounded-lg hover:bg-[#CC2B52]/5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ContactUsMessageDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        message={selectedMessage}
      />
    </div>
  );
};

export default ContactUsMessagesTable;
