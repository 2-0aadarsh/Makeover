/* eslint-disable react/prop-types */

/**
 * ServiceList - List component for displaying services
 * Shows services with edit (eye) and delete (trash) icons
 */
const ServiceList = ({ services = [], onServiceEdit, onServiceDelete }) => {
  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-gray-500 text-sm">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {services.map((service, index) => (
        <div
          key={service.id || service._id || index}
          className="px-4 py-3 border-b border-gray-200 last:border-b-0 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span
            className="font-sans"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#292D32',
            }}
          >
            {service.name || 'N/A'}
          </span>
          <div className="flex items-center gap-3">
            {/* Edit/View Icon */}
            <button
              onClick={() => onServiceEdit && onServiceEdit(service)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Edit service"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
            {/* Delete Icon */}
            <button
              onClick={() => onServiceDelete && onServiceDelete(service)}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              aria-label="Delete service"
            >
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
