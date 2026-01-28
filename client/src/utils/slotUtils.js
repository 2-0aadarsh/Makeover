/**
 * Utility functions for slot management and validation
 */

/**
 * Check if a slot should be disabled based on 30-minute buffer logic
 * @param {string} slotTime - Time slot in format "09:00 AM"
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {boolean} - True if slot should be disabled
 */
export const isSlotDisabled = (slotTime, currentTime = new Date(), selectedDate = null) => {
  // If selected date is not today, all slots are available
  const today = new Date().toISOString().split('T')[0];
  if (selectedDate && selectedDate !== today) {
    return false;
  }

  const [time, period] = slotTime.split(' ');
  const [hours, minutes] = time.split(':');
  
  // Convert to 24-hour format
  let slotHour = parseInt(hours);
  if (period === 'PM' && slotHour !== 12) {
    slotHour += 12;
  } else if (period === 'AM' && slotHour === 12) {
    slotHour = 0;
  }

  // Create slot time for today
  const slotDateTime = new Date(currentTime);
  slotDateTime.setHours(slotHour, parseInt(minutes), 0, 0);

  // Calculate difference in minutes
  const timeDiffMinutes = (slotDateTime - currentTime) / (1000 * 60);

  // Disable if less than 30 minutes advance time
  return timeDiffMinutes < 30;
};

/**
 * Get available slots for a given date
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Array} - Array of available slot times
 */
export const getAvailableSlots = (selectedDate = null, currentTime = new Date()) => {
  const allSlots = [
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

  // If selected date is not today, all slots are available
  const today = new Date().toISOString().split('T')[0];
  if (selectedDate && selectedDate !== today) {
    return allSlots;
  }

  return allSlots.filter(slot => !isSlotDisabled(slot, currentTime, selectedDate));
};

/**
 * Get disabled slots for a given date
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Array} - Array of disabled slot times
 */
export const getDisabledSlots = (selectedDate = null, currentTime = new Date()) => {
  const allSlots = [
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

  // If selected date is not today, no slots are disabled
  const today = new Date().toISOString().split('T')[0];
  if (selectedDate && selectedDate !== today) {
    return [];
  }

  return allSlots.filter(slot => isSlotDisabled(slot, currentTime, selectedDate));
};

/**
 * Format time for display
 * @param {string} timeString - Time in format "09:00 AM"
 * @returns {string} - Formatted time string
 */
export const formatSlotTime = (timeString) => {
  return timeString;
};

/**
 * Get next available slot
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {string|null} - Next available slot time or null
 */
export const getNextAvailableSlot = (selectedDate = null, currentTime = new Date()) => {
  const availableSlots = getAvailableSlots(selectedDate, currentTime);
  return availableSlots.length > 0 ? availableSlots[0] : null;
};

/**
 * Validate if a slot selection is valid
 * @param {string} slotTime - Selected slot time
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Object} - Validation result with isValid and message
 */
export const validateSlotSelection = (slotTime, selectedDate = null, currentTime = new Date()) => {
  if (!slotTime) {
    return {
      isValid: false,
      message: 'Please select a time slot'
    };
  }

  if (!selectedDate) {
    return {
      isValid: false,
      message: 'Please select a date'
    };
  }

  const isDisabled = isSlotDisabled(slotTime, currentTime, selectedDate);
  
  if (isDisabled) {
    return {
      isValid: false,
      message: 'This time slot is not available. Please select another time.'
    };
  }

  return {
    isValid: true,
    message: 'Slot selection is valid'
  };
};

/**
 * Test function to simulate different time scenarios
 * @param {string} testTime - Test time in format "10:31 AM"
 * @returns {Object} - Test results showing available and disabled slots
 */
export const testSlotAvailability = (testTime = "10:31 AM") => {
  const [time, period] = testTime.split(' ');
  const [hours, minutes] = time.split(':');
  
  let testHour = parseInt(hours);
  if (period === 'PM' && testHour !== 12) {
    testHour += 12;
  } else if (period === 'AM' && testHour === 12) {
    testHour = 0;
  }

  const testDateTime = new Date();
  testDateTime.setHours(testHour, parseInt(minutes), 0, 0);

  const availableSlots = getAvailableSlots(null, testDateTime);
  const disabledSlots = getDisabledSlots(null, testDateTime);

  return {
    testTime,
    currentTime: testDateTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    availableSlots,
    disabledSlots,
    nextAvailableSlot: getNextAvailableSlot(null, testDateTime)
  };
};
