/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const parsePincodes = (str) => {
  if (!str || typeof str !== "string") return [];
  return str
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
};
const validatePincodes = (str) => {
  const arr = parsePincodes(str);
  const valid = arr.filter((p) => PINCODE_REGEX.test(p));
  const invalid = arr.filter((p) => !PINCODE_REGEX.test(p));
  return { valid, invalid };
};

const inputClass =
  "w-full text-sm py-2 px-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52] outline-none";

/**
 * Modal when admin adds a city request to serviceable areas.
 * Requires coverage pincodes (mandatory).
 * onConfirm(coveragePincodes: string[]) is called with validated pincodes.
 */
const AddCityConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  cityName,
  stateName,
  loading = false,
}) => {
  const [coveragePincodes, setCoveragePincodes] = useState("");
  const [error, setError] = useState(null);

  useBodyScrollLock(!!isOpen);

  useEffect(() => {
    if (isOpen) {
      setCoveragePincodes("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const location = [cityName, stateName].filter(Boolean).join(", ") || "this city";

  const handleSubmit = () => {
    const { valid, invalid } = validatePincodes(coveragePincodes);
    if (valid.length === 0) {
      setError("At least one valid 6-digit coverage pincode is required (e.g. 823001).");
      return;
    }
    if (invalid.length > 0) {
      setError(`Invalid pincodes (must be 6 digits): ${invalid.join(", ")}`);
      return;
    }
    setError(null);
    onConfirm(valid);
  };

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

        <div className="flex items-start gap-4 mb-4">
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
              Add <strong>{location}</strong> to serviceable cities. Enter the coverage pincodes below (required).
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Coverage pincodes *</label>
          <textarea
            value={coveragePincodes}
            onChange={(e) => {
              setCoveragePincodes(e.target.value);
              setError(null);
            }}
            placeholder="One per line or comma-separated (e.g. 823001, 823002)"
            rows={3}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-0.5">At least one 6-digit Indian pincode required.</p>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end">
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
            onClick={handleSubmit}
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
