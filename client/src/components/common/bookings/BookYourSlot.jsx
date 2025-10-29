import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar } from "lucide-react";
import { isSlotDisabled, getAvailableSlots } from "../../../utils/slotUtils";

/**
 * BookYourSlot Component
 * 
 * Displays date and time slot selection with 30-minute buffer logic
 * Matches the exact UI design from the image
 */
const BookYourSlot = ({
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableSlots = [],
  availableDates = [],
  unavailableDates = []
}) => {
  console.log('🔍 [CRITICAL DEBUG] BookYourSlot component rendered with:', {
    selectedDate,
    selectedSlot,
    availableSlots: availableSlots.length,
    componentVersion: 'SENIOR_DEBUG_v1',
    timestamp: new Date().toISOString()
  });
  
  // Force a very obvious log to test if component is loading new code
  console.log('🚨🚨🚨 BOOKYOURSLOT COMPONENT IS LOADING NEW CODE - SENIOR DEBUG ACTIVE 🚨🚨🚨');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateType, setSelectedDateType] = useState("today");

  // Time slots configuration (9 AM to 5 PM, 1-hour intervals)
  const allTimeSlots = [
    "09:00 AM",
    "10:00 AM", 
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM"
  ];

  // Get today's date string
  const getTodayString = () => {
    return currentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  // Get tomorrow's date string
  const getTomorrowString = () => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if a slot should be disabled using utility function
  const isSlotDisabledForToday = (slotTime) => {
    if (selectedDateType !== "today") {
      return false; // All slots available for future dates
    }
    
    return isSlotDisabled(slotTime, currentDate, selectedDate);
  };

  // Handle date type selection
  const handleDateTypeSelect = (type) => {
    console.log('🔍 [SENIOR DEBUG] BookYourSlot - Date type selected:', type);
    console.log('🔍 [SENIOR DEBUG] Current state before change:', {
      selectedDateType,
      selectedDate,
      selectedSlot,
      currentDate: currentDate.toISOString()
    });
    
    setSelectedDateType(type);
    
    const today = new Date();
    let targetDate;
    
    if (type === "today") {
      // Create today's date without time (same format as calendar picker)
      targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else if (type === "tomorrow") {
      // Create tomorrow's date without time
      targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }
    
    if (targetDate && onDateChange) {
      const dateString = targetDate.toISOString().split('T')[0];
      console.log('🔍 [SENIOR DEBUG] BookYourSlot - About to call onDateChange:', {
        type,
        targetDate: targetDate.toISOString(),
        dateString,
        selectedDateType: type,
        hasTime: targetDate.getHours() !== 0 || targetDate.getMinutes() !== 0 || targetDate.getSeconds() !== 0,
        onDateChangeExists: !!onDateChange,
        onDateChangeType: typeof onDateChange
      });
      
      // Call the parent callback
      onDateChange(dateString);
      
      console.log('🔍 [SENIOR DEBUG] BookYourSlot - onDateChange called successfully');
    } else {
      console.error('🔍 [SENIOR DEBUG] BookYourSlot - Cannot call onDateChange:', {
        hasTargetDate: !!targetDate,
        hasOnDateChange: !!onDateChange,
        targetDate,
        onDateChange
      });
    }
  };

  // Handle custom date picker
  const handleCustomDateChange = (event) => {
    const dateValue = event.target.value;
    if (dateValue && onDateChange) {
      onDateChange(dateValue);
      setSelectedDateType("custom");
    }
  };

  // Update current time every minute for real-time slot updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-lg font-bold text-[#CC2B52] mb-4">
        Book Your Slot
      </h3>

      {/* Date Selection */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          {/* Today Button */}
          <button
            onClick={() => handleDateTypeSelect("today")}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              selectedDateType === "today"
                ? "bg-[#CC2B52] border-[#CC2B52] text-white"
                : "bg-white border-[#CC2B52] text-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
            }`}
          >
            Today
          </button>

          {/* Tomorrow Button */}
          <button
            onClick={() => handleDateTypeSelect("tomorrow")}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              selectedDateType === "tomorrow"
                ? "bg-[#CC2B52] border-[#CC2B52] text-white"
                : "bg-white border-[#CC2B52] text-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
            }`}
          >
            Tomorrow
          </button>

          {/* Pick Your Date Button */}
          <button
            onClick={() => handleDateTypeSelect("custom")}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
              selectedDateType === "custom"
                ? "bg-[#CC2B52] border-[#CC2B52] text-white"
                : "bg-white border-[#CC2B52] text-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Pick your date
          </button>
        </div>

        {/* Custom Date Picker (hidden by default, shown when "Pick your date" is selected) */}
        {selectedDateType === "custom" && (
          <div className="mb-4">
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={handleCustomDateChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] focus:border-transparent"
            />
          </div>
        )}

        {/* Date Display */}
        <div className="text-sm text-gray-600">
          {selectedDateType === "today" && getTodayString()}
          {selectedDateType === "tomorrow" && getTomorrowString()}
          {selectedDateType === "custom" && selectedDate && (
            new Date(selectedDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })
          )}
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          {allTimeSlots.map((slot) => {
            const isDisabled = isSlotDisabledForToday(slot);
            const isSelected = selectedSlot === slot;
            
            return (
              <button
                key={slot}
                onClick={() => !isDisabled && onSlotSelect && onSlotSelect(slot)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                  isSelected
                    ? "bg-[#CC2B52] border-[#CC2B52] text-white"
                    : isDisabled
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-[#CC2B52] text-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Status Information */}
      <div className="text-xs text-gray-500">
        {selectedDateType === "today" && (
          <p>
            Available slots require at least 30 minutes advance booking time.
          </p>
        )}
        {selectedDateType !== "today" && (
          <p>
            All slots are available for future dates.
          </p>
        )}
      </div>
    </div>
  );
};

BookYourSlot.propTypes = {
  selectedDate: PropTypes.string,
  onDateChange: PropTypes.func,
  selectedSlot: PropTypes.string,
  onSlotSelect: PropTypes.func,
  availableSlots: PropTypes.array,
  availableDates: PropTypes.array,
  unavailableDates: PropTypes.array
};

export default BookYourSlot;