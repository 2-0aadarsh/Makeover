/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";

/**
 * ToggleAdminStatusModal - Custom confirmation modal for toggling admin status
 * Matches business design with consistent styling
 */
const ToggleAdminStatusModal = ({ adminName, isActive, onConfirm, onCancel }) => {
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "hidden";

    // Set initial focus to the "No" button for accessibility
    noButtonRef.current?.focus();

    return () => (body.style.overflowY = "scroll");
  }, []);

  // Trap focus between No and Yes buttons with Tab/Shift+Tab
  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab") return;

    const a = document.activeElement;
    const onNo = a === noButtonRef.current;
    const onYes = a === yesButtonRef.current;

    if (e.shiftKey) {
      // Reverse tab order
      if (onNo) {
        e.preventDefault();
        yesButtonRef.current?.focus();
      } else if (onYes) {
        e.preventDefault();
        noButtonRef.current?.focus();
      }
    } else {
      // Forward tab order
      if (onNo) {
        e.preventDefault();
        yesButtonRef.current?.focus();
      } else if (onYes) {
        e.preventDefault();
        noButtonRef.current?.focus();
      } else {
        // If focus somehow lands outside, send it to No
        e.preventDefault();
        noButtonRef.current?.focus();
      }
    }
  }, []);

  const action = isActive ? "deactivate" : "activate";
  const actionCapitalized = isActive ? "Deactivate" : "Activate";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toggle-status-title"
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>

        <p
          id="toggle-status-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-2"
        >
          Are you sure you want to {action}{" "}
          <span className="font-semibold">&quot;{adminName}&quot;</span>?
        </p>
        <p className="text-sm text-gray-600 mb-8">
          {isActive
            ? "The admin will be deactivated and will not be able to access the system."
            : "The admin will be activated and will be able to access the system."}
        </p>

        <div className="flex justify-between gap-4">
          <button
            ref={noButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1 px-4 py-2 border border-[#CC2B52] text-[#CC2B52] rounded-md hover:bg-[#CC2B52] hover:text-white transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            ref={yesButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="flex-1 px-4 py-2 bg-[#CC2B52] text-white rounded-md hover:bg-[#B02547] transition-colors font-medium"
          >
            {actionCapitalized}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleAdminStatusModal;
