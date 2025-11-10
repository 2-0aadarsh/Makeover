import BookingService from '../services/booking.service.js';
import mongoose from 'mongoose';

/**
 * Create a new booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingData = {
      ...req.body,
      userId
    };

    const result = await BookingService.createBooking(bookingData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json({
      success: true,
      data: result.data,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error in createBooking controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all bookings for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      dateFrom,
      dateTo,
      service,
      page = 1,
      limit = 10
    } = req.query;

    const options = {
      status,
      dateFrom,
      dateTo,
      service,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await BookingService.getUserBookings(userId, options);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getUserBookings controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific booking by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const result = await BookingService.getBookingById(bookingId, userId);

    if (!result.success) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getBookingById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update booking status (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status, notes } = req.body;
    const updatedBy = req.user.id;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const result = await BookingService.updateBookingStatus(bookingId, status, updatedBy, notes);

    if (!result.success) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateBookingStatus controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Cancel a booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { cancellationReason } = req.body;
    const cancelledBy = {
      id: req.user.id,
      role: req.user.role || 'customer'
    };

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    const result = await BookingService.cancelBooking(bookingId, cancellationReason, cancelledBy);

    if (!result.success) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in cancelBooking controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Reschedule a booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const rescheduleBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { newDate, newSlot } = req.body;
    const rescheduledBy = req.user.id;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const result = await BookingService.rescheduleBooking(bookingId, newDate, newSlot, rescheduledBy);

    if (!result.success) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in rescheduleBooking controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update payment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const paymentDetails = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const result = await BookingService.updatePaymentStatus(bookingId, paymentDetails);

    if (!result.success) {
      const statusCode = result.error === 'NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updatePaymentStatus controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get booking statistics for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await BookingService.getBookingStats(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getBookingStats controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get upcoming bookings for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const result = await BookingService.getUpcomingBookings(userId, limit);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getUpcomingBookings controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Search bookings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q: searchQuery, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const options = {
      status,
      dateFrom,
      dateTo,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await BookingService.searchBookings(userId, searchQuery.trim(), options);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in searchBookings controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get booking analytics (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBookingAnalytics = async (req, res) => {
  try {
    const { dateFrom, dateTo, status } = req.query;

    const filters = {
      dateFrom,
      dateTo,
      status
    };

    const result = await BookingService.getBookingAnalytics(filters);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getBookingAnalytics controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get available time slots for a specific date
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const bookingDate = new Date(date);
    
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Get all time slots (you can customize this based on your business hours)
    const allSlots = [
      '09:00 AM - 09:45 AM',
      '10:00 AM - 10:45 AM',
      '11:00 AM - 11:45 AM',
      '12:00 PM - 12:45 PM',
      '01:00 PM - 01:45 PM',
      '02:00 PM - 02:45 PM',
      '03:00 PM - 03:45 PM',
      '04:00 PM - 04:45 PM',
      '05:00 PM - 05:45 PM',
      '06:00 PM - 06:45 PM'
    ];

    // Find booked slots for the date
    const bookedSlots = await Booking.find({
      'bookingDetails.date': bookingDate,
      status: { $in: ['confirmed', 'pending'] }
    }).select('bookingDetails.slot');

    const bookedSlotStrings = bookedSlots.map(booking => booking.bookingDetails.slot);
    
    // Filter available slots
    const availableSlots = allSlots.filter(slot => !bookedSlotStrings.includes(slot));

    res.status(200).json({
      success: true,
      data: {
        date: bookingDate.toISOString().split('T')[0],
        availableSlots,
        bookedSlots: bookedSlotStrings,
        totalSlots: allSlots.length,
        availableCount: availableSlots.length
      },
      message: 'Available slots retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getAvailableSlots controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};