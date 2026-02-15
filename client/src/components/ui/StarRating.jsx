/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { Star } from "lucide-react";

/**
 * StarRating Component
 * 
 * A reusable star rating component with support for:
 * - Half-star ratings (0.5 increments)
 * - Read-only display mode
 * - Hover preview
 * - Keyboard accessibility
 * - Custom sizes and colors
 * 
 * @param {number} value - Current rating value (0.5-5)
 * @param {function} onChange - Callback when rating changes
 * @param {boolean} readOnly - If true, rating cannot be changed
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} showValue - Show numeric value next to stars
 * @param {string} className - Additional CSS classes
 */
const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showValue = false,
  className = "",
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  // Size configurations
  const sizeConfig = {
    sm: { star: 16, gap: "gap-0.5", text: "text-xs" },
    md: { star: 24, gap: "gap-1", text: "text-sm" },
    lg: { star: 32, gap: "gap-1.5", text: "text-base" },
    xl: { star: 40, gap: "gap-2", text: "text-lg" },
  };
  
  const config = sizeConfig[size] || sizeConfig.md;
  const displayValue = hoverValue || value;
  
  /**
   * Calculate star fill based on rating
   * Returns: 'full', 'half', or 'empty'
   */
  const getStarFill = (starIndex) => {
    const starValue = starIndex + 1;
    
    if (displayValue >= starValue) {
      return "full";
    } else if (displayValue >= starValue - 0.5) {
      return "half";
    }
    return "empty";
  };
  
  /**
   * Handle mouse position to determine half/full star
   */
  const handleMouseMove = useCallback((e, starIndex) => {
    if (readOnly) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    
    setHoverValue(starIndex + (isHalf ? 0.5 : 1));
  }, [readOnly]);
  
  /**
   * Handle click to set rating
   */
  const handleClick = useCallback((e, starIndex) => {
    if (readOnly || !onChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    
    const newValue = starIndex + (isHalf ? 0.5 : 1);
    onChange(newValue);
  }, [readOnly, onChange]);
  
  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e) => {
    if (readOnly || !onChange) return;
    
    const currentValue = value || 0;
    
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        onChange(Math.min(5, currentValue + 0.5));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        onChange(Math.max(0.5, currentValue - 0.5));
        break;
      case "Home":
        e.preventDefault();
        onChange(0.5);
        break;
      case "End":
        e.preventDefault();
        onChange(5);
        break;
      default:
        break;
    }
  }, [readOnly, onChange, value]);
  
  /**
   * Render individual star with proper fill
   */
  const renderStar = (starIndex) => {
    const fill = getStarFill(starIndex);
    const starSize = config.star;
    
    return (
      <div
        key={starIndex}
        className={`relative ${readOnly ? "" : "cursor-pointer"}`}
        onMouseMove={(e) => handleMouseMove(e, starIndex)}
        onClick={(e) => handleClick(e, starIndex)}
        role={readOnly ? "presentation" : "button"}
        tabIndex={readOnly ? -1 : 0}
        aria-label={`Rate ${starIndex + 1} stars`}
      >
        {/* Empty star background */}
        <Star
          size={starSize}
          className="text-gray-300"
          strokeWidth={1.5}
        />
        
        {/* Filled star overlay */}
        {fill !== "empty" && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: fill === "half" ? "50%" : "100%" }}
          >
            <Star
              size={starSize}
              className="text-yellow-400 fill-yellow-400"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div
      className={`inline-flex items-center ${config.gap} ${className}`}
      onMouseLeave={() => setHoverValue(0)}
      onKeyDown={handleKeyDown}
      role={readOnly ? "img" : "slider"}
      aria-label={`Rating: ${value} out of 5 stars`}
      aria-valuenow={value}
      aria-valuemin={0.5}
      aria-valuemax={5}
      aria-readonly={readOnly}
    >
      {/* Stars */}
      <div className={`flex ${config.gap}`}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      
      {/* Optional numeric value display */}
      {showValue && (
        <span className={`${config.text} font-medium text-gray-700 ml-2`}>
          {displayValue > 0 ? displayValue.toFixed(1) : "0.0"}
        </span>
      )}
    </div>
  );
};

/**
 * StarRatingDisplay - Read-only variant for displaying ratings
 * Simplified wrapper around StarRating
 */
export const StarRatingDisplay = ({ rating, size = "sm", showValue = true, className = "" }) => (
  <StarRating
    value={rating}
    readOnly
    size={size}
    showValue={showValue}
    className={className}
  />
);

export default StarRating;
