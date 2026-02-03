/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

const RemoveServiceModal = ({ serviceName, onConfirm, onCancel }) => {
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  useBodyScrollLock(true);
  useEffect(() => {
    noButtonRef.current?.focus();
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
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-hidden overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-service-title"
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
          id="remove-service-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-8"
        >
          Are you sure you want to remove this{" "}
          <span className="font-semibold">&quot;{serviceName}&quot;</span>{" "}
          service?
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
            No
          </button>
          <button
            ref={yesButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="flex-1 px-4 py-2 bg-[#CC2B52] text-white rounded-md hover:bg-[#B02547] transition-colors font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveServiceModal;
