/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";

/**
 * AdminDeactivatedModal - Custom modal for displaying admin deactivation message
 * Matches business design with consistent styling
 */
const AdminDeactivatedModal = ({ isOpen, onClose, onRedirect }) => {
  const okButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const body = document.querySelector("body");
      body.style.overflowY = "hidden";

      // Set initial focus to the "OK" button for accessibility
      okButtonRef.current?.focus();

      return () => {
        body.style.overflowY = "scroll";
      };
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && isOpen) {
      handleRedirect();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleRedirect = () => {
    if (onRedirect) {
      onRedirect();
    } else {
      onClose();
      window.location.href = '/auth/login';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleRedirect}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-deactivated-title"
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
          id="admin-deactivated-title"
          className="text-lg sm:text-[20px] text-[#CC2B52] leading-6 font-medium mb-2"
        >
          Account Deactivated
        </p>
        <p className="text-sm text-gray-600 mb-8">
          Your admin account has been deactivated. Please contact the system administrator.
        </p>

        <button
          ref={okButtonRef}
          onClick={handleRedirect}
          className="w-full px-4 py-2 bg-[#CC2B52] text-white rounded-md hover:bg-[#B02547] transition-colors font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AdminDeactivatedModal;
