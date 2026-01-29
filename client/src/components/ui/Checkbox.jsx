/* eslint-disable react/prop-types */
import { useId } from "react";

/**
 * Checkbox - Custom checkbox matching business design (#CC2B52)
 * Replaces default browser checkbox for consistent UI.
 */
const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  helperText,
  name,
  className = "",
  labelClassName = "",
}) => {
  const id = useId();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`flex items-start gap-3 cursor-pointer ${disabled ? "cursor-not-allowed opacity-60" : ""} ${labelClassName}`}
      >
        <span className="relative inline-flex flex-shrink-0 mt-0.5 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange?.(e)}
            disabled={disabled}
            className="sr-only peer"
            aria-checked={checked}
          />
          <span
            className={`relative flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 peer-focus:ring-2 peer-focus:ring-[#CC2B52]/30 peer-focus:ring-offset-1 ${
              checked
                ? "bg-[#CC2B52] border-[#CC2B52]"
                : "bg-white border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-60" : ""}`}
            aria-hidden
          >
            {checked && (
              <svg
                className="w-3.5 h-3.5 text-white pointer-events-none flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        </span>
        {label && (
          <span
            className="font-sans text-[#292D32] font-semibold"
            style={{ fontSize: "16px" }}
          >
            {label}
          </span>
        )}
      </label>
      {helperText && (
        <p
          className="text-gray-500 font-sans mt-1 ml-8"
          style={{ fontSize: "14px" }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
