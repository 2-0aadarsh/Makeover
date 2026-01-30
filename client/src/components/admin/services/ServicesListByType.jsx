/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_TYPE_DISPLAY_ORDER } from "../../../constants";
import ServiceList from "./ServiceList";

const SERVICE_TYPE_TO_DISPLAY = {
  Standard: "Regular",
  Premium: "Premium",
  Bridal: "Bridal",
  Classic: "Classic",
  Regular: "Regular",
};

const getDisplayName = (serviceType) =>
  SERVICE_TYPE_TO_DISPLAY[serviceType] || "Regular";

/**
 * ServicesListByType - Groups services by service type in collapsible accordion sections.
 * Uses SERVICE_TYPE_DISPLAY_ORDER (Regular → Classic → Premium → Bridal).
 */
const ServicesListByType = ({
  services = [],
  onServiceEdit,
  onServiceDelete,
  onToggleAvailability,
  onToggleActive,
}) => {
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    SERVICE_TYPE_DISPLAY_ORDER.forEach((t) => {
      initial[t] = true;
    });
    return initial;
  });

  const groupedAndOrdered = useMemo(() => {
    const grouped = {};
    services.forEach((s) => {
      const type = getDisplayName(s.serviceType || "Standard");
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(s);
    });
    const ordered = SERVICE_TYPE_DISPLAY_ORDER.filter((t) => grouped[t]?.length);
    const other = Object.keys(grouped).filter((t) => !SERVICE_TYPE_DISPLAY_ORDER.includes(t));
    other.forEach((t) => ordered.push(t));
    return ordered.map((type) => ({ type, list: grouped[type] || [] }));
  }, [services]);

  const toggleSection = (type) => {
    setExpandedSections((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <p className="text-gray-500 text-sm font-sans">No services found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groupedAndOrdered.map(({ type, list }) => {
        const isExpanded = expandedSections[type] !== false;
        const count = list.length;

        return (
          <div
            key={type}
            className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleSection(type)}
              className="w-full bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 flex items-center justify-between gap-3 text-left border-0 cursor-pointer"
              aria-expanded={isExpanded}
              aria-controls={`services-section-${type}`}
              id={`services-header-${type}`}
            >
              <span
                className="font-sans font-semibold text-[#292D32]"
                style={{ fontSize: "15px" }}
              >
                {type}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">({count})</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </span>
            </button>
            <div
              id={`services-section-${type}`}
              role="region"
              aria-labelledby={`services-header-${type}`}
              className={isExpanded ? "border-t border-gray-200" : "hidden"}
            >
              {isExpanded && list.length > 0 && (
                <ServiceList
                  services={list}
                  onServiceEdit={onServiceEdit}
                  onServiceDelete={onServiceDelete}
                  onToggleAvailability={onToggleAvailability}
                  onToggleActive={onToggleActive}
                  nested
                />
              )}
              {isExpanded && list.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 italic font-sans">
                  No services in this type
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesListByType;
