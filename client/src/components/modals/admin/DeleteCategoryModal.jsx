/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";

const DeleteCategoryModal = ({ categoryName, serviceCount = 0, onConfirm, onCancel }) => {
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

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-category-title"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <p
          id="delete-category-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-2"
        >
          Delete Category?
        </p>
        <p className="text-base text-gray-700 mb-2 font-semibold">
          &quot;{categoryName}&quot;
        </p>
        
        {serviceCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ This category has {serviceCount} service{serviceCount > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Deleting this category may affect associated services
            </p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone
        </p>

        <div className="flex justify-between gap-4">
          <button
            ref={noButtonRef}
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
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="flex-1 px-4 py-2 bg-[#CC2B52] text-white rounded-md hover:bg-[#B02547] transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
