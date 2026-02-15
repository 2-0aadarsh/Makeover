import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

/**
 * InvalidateOnboardingLinkModal - Custom modal for invalidating onboarding link
 * Consistent with other admin modals design
 */
const InvalidateOnboardingLinkModal = ({ adminName, onConfirm, onCancel }) => {
  useBodyScrollLock(true);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden overscroll-contain">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3
            className="text-lg font-semibold font-sans"
            style={{ color: "#CC2B52" }}
          >
            Invalidate Onboarding Link
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 font-sans mb-4" style={{ fontSize: "15px" }}>
            Are you sure you want to invalidate the onboarding link for{" "}
            <strong>{adminName}</strong>?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-sans">
              <strong>⚠️ Important:</strong> Once invalidated, the current onboarding link will no longer work. 
              The admin will need a new link to complete onboarding. You can resend a new link after invalidating this one.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-sans"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#292D32",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-sans"
            style={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Invalidate Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvalidateOnboardingLinkModal;
