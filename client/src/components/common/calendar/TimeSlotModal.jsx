import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

/**
 * TimeSlotModal Component
 *
 * A modal for selecting preferred time slots
 * Features:
 * - Grid layout of time slots
 * - Single time slot selection
 * - Confirm button to proceed
 * - Body overflow control
 */
const TimeSlotModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedTimeSlot,
  availableTimeSlots = [],
  selectedDate = "",
}) => {
  const [tempSelectedSlot, setTempSelectedSlot] = useState(
    selectedTimeSlot || ""
  );

  // Handle body overflow when modal opens/closes (same as ServiceModal)
  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "hidden";

    return () => (body.style.overflowY = "scroll");
  }, []);

  // Reset temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedSlot(selectedTimeSlot || "");
    }
  }, [isOpen, selectedTimeSlot]);

  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    setTempSelectedSlot(slot);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (tempSelectedSlot && onConfirm) {
      onConfirm(tempSelectedSlot);
      onClose();
    }
  };

  // Format selected date for display
  const formatSelectedDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Default time slots if none provided
  const defaultTimeSlots = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const timeSlots =
    availableTimeSlots.length > 0 ? availableTimeSlots : defaultTimeSlots;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        !isOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Select Preferred Time Slot
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close time slot modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Selected Date:{" "}
              <span className="font-medium text-gray-800">
                {formatSelectedDate(selectedDate)}
              </span>
            </p>
          </div>
        )}

        {/* Time Slots Grid */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotSelect(slot)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tempSelectedSlot === slot
                    ? "bg-[#CC2B52] text-white border-[#CC2B52]"
                    : "bg-white text-[#CC2B52] border border-[#CC2B52] hover:bg-[#CC2B52] hover:text-white"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!tempSelectedSlot}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              tempSelectedSlot
                ? "bg-[#CC2B52] text-white hover:bg-[#CC2B52]/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Time Slot
          </button>
        </div>
      </div>
    </div>
  );
};

TimeSlotModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedTimeSlot: PropTypes.string,
  availableTimeSlots: PropTypes.arrayOf(PropTypes.string),
  selectedDate: PropTypes.string,
};

export default TimeSlotModal;





