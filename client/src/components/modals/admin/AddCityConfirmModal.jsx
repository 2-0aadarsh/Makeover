/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

/**
 * Confirmation modal when admin marks a city request as "added".
 * Matches app modal style (DiscardConfirmModal / LogoutModal).
 */
const AddCityConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  cityName,
  stateName,
  loading = false,
}) => {
  useBodyScrollLock(!!isOpen);
  if (!isOpen) return null;

  const location = [cityName, stateName].filter(Boolean).join(", ") || "this city";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden overscroll-contain">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-city-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#CC2B52]/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#CC2B52]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="add-city-modal-title"
              className="text-lg font-semibold text-gray-900 mb-1"
            >
              Add city to serviceable areas?
            </h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to add your services in <strong>{location}</strong> and
              update the database of serviceable cities? Users will be able to book in this city.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add city"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCityConfirmModal;
