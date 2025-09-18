import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Calendar Component
 *
 * A custom calendar modal for date selection with admin availability checking
 * Features:
 * - No past dates selectable
 * - Single date selection only
 * - 2-year date range
 * - Admin availability checking
 * - Current date display section
 */
const Calendar = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  availableDates = [], // Array of available dates in 'YYYY-MM-DD' format
  unavailableDates = [], // Array of unavailable dates in 'YYYY-MM-DD' format
}) => {
  // Handle body overflow when modal opens/closes (same as ServiceModal)
  useEffect(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "hidden";

    return () => (body.style.overflowY = "scroll");
  }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate max date (2 years from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Format date to YYYY-MM-DD string
  const formatDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Check if a date is available (not in unavailableDates and in availableDates if provided)
  const isDateAvailable = (date) => {
    const dateString = formatDateString(date);

    // If date is in unavailableDates, it's not available
    if (unavailableDates.includes(dateString)) {
      return false;
    }

    // If availableDates is provided and not empty, check if date is in it
    if (availableDates && availableDates.length > 0) {
      return availableDates.includes(dateString);
    }

    // If no specific availability data, assume all future dates are available
    return true;
  };

  // Check if a date is selectable
  const isDateSelectable = (date) => {
    // Can't select past dates
    if (date < today) {
      return false;
    }

    // Can't select dates beyond 2 years
    if (date > maxDate) {
      return false;
    }

    // Check admin availability
    return isDateAvailable(date);
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelectable = isDateSelectable(date);
      const isSelected =
        selectedDate &&
        formatDateString(date) === formatDateString(selectedDate);

      days.push({
        day,
        date,
        isSelectable,
        isSelected,
        isToday: formatDateString(date) === formatDateString(today),
      });
    }

    return days;
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle date selection
  const handleDateClick = (dayObj) => {
    if (dayObj.isSelectable) {
      onDateSelect(dayObj.date);
      onClose(); // Close modal after selection
    }
  };

  // Update current month/year when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const calendarDays = generateCalendarDays();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        !isOpen ? "hidden" : ""
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
        {/* Current Date Section */}
        <div className="relative p-6 bg-gradient-to-r from-[#CC2B52] to-[#E91E63] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close calendar"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-sm opacity-90 mb-1">{today.getFullYear()}</div>
            <div className="text-2xl font-bold">
              {today.toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-lg font-semibold text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayObj, index) => {
              if (!dayObj) {
                return <div key={index} className="h-10" />;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(dayObj)}
                  disabled={!dayObj.isSelectable}
                  className={`
                    h-10 w-10 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      dayObj.isSelected
                        ? "bg-[#CC2B52] text-white"
                        : dayObj.isToday
                        ? "bg-gray-200 text-gray-800 border-2 border-[#CC2B52]"
                        : dayObj.isSelectable
                        ? "text-gray-800 hover:bg-gray-100 hover:text-[#CC2B52]"
                        : "text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  availableDates: PropTypes.arrayOf(PropTypes.string),
  unavailableDates: PropTypes.arrayOf(PropTypes.string),
};

export default Calendar;
