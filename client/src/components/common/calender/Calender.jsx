import React, { useState } from "react";

const Calendar = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const availableYears = Array.from({ length: 2 }, (_, i) => currentYear + i);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getStartDay = (year, month) => {
    let day = new Date(year, month, 1).getDay(); 
    return day === 0 ? 6 : day - 1; 
  };

  const renderCalendar = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDay(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-gray-400"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        day === selectedDate.day &&
        month === selectedDate.month &&
        year === selectedDate.year;

      const isPastDate = 
        year < currentYear || 
        (year === currentYear && month < currentMonth) ||
        (year === currentYear && month === currentMonth && day < today.getDate());

      days.push(
        <div
          key={day}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
            isPastDate
              ? "text-gray-300 cursor-not-allowed"
              : "cursor-pointer"
          } ${
            isSelected
              ? "bg-pink-500 text-white font-bold"
              : isPastDate
              ? ""
              : "hover:bg-gray-200"
          }`}
          onClick={() => {
            if (!isPastDate) {
              setSelectedDate({ day, month, year: selectedYear });
            }
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Navigation
  const handleNext = () => {
    if (selectedMonth < 11 || selectedYear < currentYear + 5) {
      if (selectedMonth < 11) {
        setSelectedMonth((prev) => prev + 1);
      } else if (selectedYear < currentYear + 5) {
        setSelectedYear((prev) => prev + 1);
        setSelectedMonth(0);
      }
    }
  };

  const handlePrev = () => {
    if (selectedMonth > 0 || selectedYear > currentYear) {
      if (selectedMonth > 0) {
        setSelectedMonth((prev) => prev - 1);
      } else if (selectedYear > currentYear) {
        setSelectedYear((prev) => prev - 1);
        setSelectedMonth(11);
      }
    } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearDropdown(false);

    if (year === currentYear) {
      setSelectedMonth(currentMonth);
    } else {
      setSelectedMonth(0);
    }
  };
  const selectedDateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="w-80 mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
      
      <div className="bg-pink-600 text-white py-6 px-6">
        <div className="relative text-left">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="text-sm opacity-90 hover:opacity-100 transition-opacity duration-200 cursor-pointer block mb-2"
          >
            {selectedYear} ▼
          </button>
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg border z-10">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                    year === selectedYear ? 'bg-pink-50 text-pink-600 font-medium' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        <h2 className="text-4xl font-light">{formattedSelectedDate}</h2>
      </div>

      {/* Calendar Section */}
      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={handlePrev}
            disabled={selectedYear === currentYear && selectedMonth === currentMonth}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:shadow-none"
          >
            ‹
          </button>
          <h3 className="font-medium text-gray-800">
            {months[selectedMonth]} {selectedYear}
          </h3>
          <button
            onClick={handleNext}
            disabled={selectedYear === currentYear + 5 && selectedMonth === 11}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:shadow-none"
          >
            ›
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
          {weekdays.map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {renderCalendar(selectedYear, selectedMonth)}
        </div>
      </div>
    </div>
  );
};

export default Calendar;