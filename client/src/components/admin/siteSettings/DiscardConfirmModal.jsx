/* eslint-disable react/prop-types */
import { AlertTriangle, X } from 'lucide-react';
import useBodyScrollLock from '../../../hooks/useBodyScrollLock';

const DiscardConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Discard unsaved changes?', message = 'You have unsaved changes. Are you sure you want to discard them? They will not be applied.' }) => {
  useBodyScrollLock(!!isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden overscroll-contain">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discard-modal-title"
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
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="discard-modal-title" className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h2>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardConfirmModal;
