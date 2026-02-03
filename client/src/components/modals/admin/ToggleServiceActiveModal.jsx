/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

/**
 * ToggleServiceActiveModal - Confirmation modal for toggling service active status
 * "Active" = visible on site; "Inactive" = hidden from public listings
 */
const ToggleServiceActiveModal = ({ serviceName, isActive, onConfirm, onCancel }) => {
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

  const actionCapitalized = isActive ? "Deactivate" : "Activate";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-hidden overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toggle-service-active-title"
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <p
          id="toggle-service-active-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-2"
        >
          {actionCapitalized} service?
        </p>
        <p className="text-base text-gray-700 mb-6 font-semibold">
          &quot;{serviceName}&quot;
        </p>
        <p className="text-sm text-gray-600 mb-6">
          {isActive
            ? "This service will be hidden from the site and will not appear in category modals or listings."
            : "This service will appear again on the site and in public listings."}
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
              isActive
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

export default ToggleServiceActiveModal;
