/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Select - Custom dropdown component matching business design
 * 
 * Features:
 * - Custom styled dropdown matching design system
 * - Smooth animations
 * - Keyboard navigation support
 * - Accessible (ARIA attributes)
 * - Consistent with Input component styling
 * - Refined UI with pleasant colors and spacing
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  error = null,
  height = "44px",
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle escape key
  const handleEscape = (e) => {
    if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
      selectRef.current?.focus();
    }
  };

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Handle option selection
  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    setIsOpen(false);
    selectRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Navigate to next option
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          handleSelect(options[nextIndex].value);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          handleSelect(options[prevIndex].value);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Label */}
      {label && showLabel && (
        <label
          className={`block font-sans ${labelClassName}`}
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#292D32",
            letterSpacing: "0.01em",
          }}
        >
          {label}
          {required && <span className="text-[#CC2B52] ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        {/* Select Button */}
        <button
          ref={selectRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-required={required}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white font-sans text-left flex items-center justify-between transition-all duration-300 ease-in-out ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              : isOpen
              ? "border-[#CC2B52] focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52] shadow-sm"
              : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC2B52]/20 focus:border-[#CC2B52]"
          } ${
            disabled
              ? "bg-gray-50 cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-gray-400 hover:shadow-sm active:shadow-none"
          } ${!selectedOption ? "text-gray-400" : "text-[#292D32]"}`}
          style={{
            fontSize: "15px",
            fontWeight: 400,
            height: height,
            lineHeight: "1.5",
          }}
        >
          <span className="flex-1 text-left pr-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {displayValue}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-all duration-300 ease-in-out flex-shrink-0 ${
              isOpen ? "rotate-180 text-[#CC2B52]" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            role="listbox"
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto dropdown-fade-in"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-400 text-center font-medium">
                No options available
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left font-sans transition-all duration-200 ease-in-out first:rounded-t-xl last:rounded-b-xl ${
                    value === option.value
                      ? "bg-[#FFF5F7] text-[#CC2B52] border-l-3 border-[#CC2B52] font-medium"
                      : "text-[#292D32] hover:bg-gray-50 hover:text-[#CC2B52]"
                  } ${
                    option.disabled
                      ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[#292D32]"
                      : "cursor-pointer"
                  } ${
                    index !== options.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                  style={{
                    fontSize: "15px",
                    fontWeight: value === option.value ? 500 : 400,
                    lineHeight: "1.5",
                    borderLeftWidth: value === option.value ? "3px" : "0px",
                  }}
                  disabled={option.disabled}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 font-sans mt-0.5 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
