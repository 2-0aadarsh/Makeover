/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

/**
 * ToggleServiceAvailabilityModal - Confirmation modal for toggling service availability
 * "Available" = shown as bookable; "Unavailable" = shown as "Not available at the moment"
 */
const ToggleServiceAvailabilityModal = ({ serviceName, isAvailable, onConfirm, onCancel }) => {
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  useBodyScrollLock(true);
  useEffect(() => {
    noButtonRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab") return;
    const a = document.activeElement;
    const onNo = a === noButtonRef.current;
    const onYes = a === yesButtonRef.current;
    if (e.shiftKey) {
      if (onNo) {
        e.preventDefault();
        yesButtonRef.current?.focus();
      } else if (onYes) {
        e.preventDefault();
        noButtonRef.current?.focus();
      }
    } else {
      if (onNo) {
        e.preventDefault();
        yesButtonRef.current?.focus();
      } else if (onYes) {
        e.preventDefault();
        noButtonRef.current?.focus();
      } else {
        e.preventDefault();
        noButtonRef.current?.focus();
      }
    }
  }, []);

  const actionCapitalized = isAvailable ? "Mark unavailable" : "Mark available";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-hidden overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toggle-service-availability-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-[#CC2B52] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p
          id="toggle-service-availability-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-2"
        >
          {actionCapitalized}?
        </p>
        <p className="text-base text-gray-700 mb-6 font-semibold">
          &quot;{serviceName}&quot;
        </p>
        <p className="text-sm text-gray-600 mb-6">
          {isAvailable
            ? "This service will show as &quot;Not available at the moment&quot; on the site. Customers can still see it but cannot add it to cart."
            : "This service will be available for booking again."}
        </p>

        <div className="flex justify-between gap-4">
          <button
            ref={noButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            ref={yesButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className={`flex-1 px-4 py-2 rounded-md transition-colors font-medium ${
              isAvailable
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {actionCapitalized}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleServiceAvailabilityModal;
