/* eslint-disable react/prop-types */
import { Edit2, Trash2, Power, PowerOff, CheckCircle, XCircle } from "lucide-react";

/**
 * ServiceList - List component for displaying services
 * Shows status badges (Active, Available), toggle availability, toggle active, edit, delete
 */
const ServiceList = ({
  services = [],
  onServiceEdit,
  onServiceDelete,
  onToggleAvailability,
  onToggleActive,
}) => {
  const getActiveBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
        Inactive
      </span>
    );
  };

  const getAvailableBadge = (isAvailable) => {
    if (isAvailable) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Available
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Not available
      </span>
    );
  };

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-gray-500 text-sm">No services found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {services.map((service, index) => {
        const isActive = service.isActive !== false;
        const isAvailable = service.isAvailable !== false;
        const serviceId = service.id || service._id;

        return (
          <div
            key={serviceId || index}
            className="px-4 py-3 border-b border-gray-200 last:border-b-0 flex flex-wrap items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
              <span
                className="font-sans font-medium text-[#292D32] truncate"
                style={{ fontSize: "14px" }}
              >
                {service.name || "N/A"}
              </span>
              {getActiveBadge(isActive)}
              {getAvailableBadge(isAvailable)}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Toggle Active (show/hide on site) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive?.(service);
                }}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title={isActive ? "Deactivate (hide from site)" : "Activate (show on site)"}
                aria-label={isActive ? "Deactivate service" : "Activate service"}
              >
                {isActive ? (
                  <Power className="w-4 h-4 text-green-600" />
                ) : (
                  <PowerOff className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {/* Toggle Availability (available / not at the moment) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAvailability?.(service);
                }}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title={
                  isAvailable
                    ? "Mark as not available at the moment"
                    : "Mark as available"
                }
                aria-label={
                  isAvailable ? "Mark unavailable" : "Mark available"
                }
              >
                {isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-600" />
                )}
              </button>
              {/* Edit */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceEdit?.(service);
                }}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                aria-label="Edit service"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              {/* Delete */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceDelete?.(service);
                }}
                className="p-2 hover:bg-red-50 rounded transition-colors"
                aria-label="Delete service"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceList;
