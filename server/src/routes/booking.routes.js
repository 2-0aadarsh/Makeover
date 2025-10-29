import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  rescheduleBooking,
  updatePaymentStatus,
  getBookingStats,
  getUpcomingBookings,
  searchBookings,
  getBookingAnalytics,
  getAvailableSlots
} from '../controllers/booking.controller.js';

import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  validateBookingCreation,
  validateBookingUpdate,
  checkBookingOwnership,
  checkBookingModifiable,
  checkSlotAvailability,
  sanitizeBookingData,
  validatePagination,
  validateBookingFilters
} from '../middlewares/booking.middleware.js';

const router = express.Router();

// Apply authentication to all booking routes
router.use(authenticateToken);

// Public routes (authenticated users only)

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the authenticated user
 * @access  Private
 * @query   status, dateFrom, dateTo, service, page, limit
 */
router.get('/my-bookings',
  validatePagination,
  validateBookingFilters,
  getUserBookings
);

/**
 * @route   GET /api/bookings/upcoming
 * @desc    Get upcoming bookings for the authenticated user
 * @access  Private
 * @query   limit
 */
router.get('/upcoming',
  getUpcomingBookings
);

/**
 * @route   GET /api/bookings/stats
 * @desc    Get booking statistics for the authenticated user
 * @access  Private
 */
router.get('/stats',
  getBookingStats
);

/**
 * @route   GET /api/bookings/search
 * @desc    Search bookings for the authenticated user
 * @access  Private
 * @query   q (search query), status, dateFrom, dateTo, page, limit
 */
router.get('/search',
  validatePagination,
  validateBookingFilters,
  searchBookings
);

/**
 * @route   GET /api/bookings/available-slots
 * @desc    Get available time slots for a specific date
 * @access  Private
 * @query   date
 */
router.get('/available-slots',
  getAvailableSlots
);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 * @body    services, bookingDetails, pricing
 */
router.post('/',
  sanitizeBookingData,
  validateBookingCreation,
  createBooking
);

// Routes requiring booking ID parameter

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a specific booking by ID
 * @access  Private (user can only access their own bookings)
 */
router.get('/:id',
  checkBookingOwnership,
  getBookingById
);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (user can only cancel their own bookings)
 * @body    cancellationReason
 */
router.put('/:id/cancel',
  checkBookingOwnership,
  checkBookingModifiable,
  sanitizeBookingData,
  cancelBooking
);

/**
 * @route   PUT /api/bookings/:id/reschedule
 * @desc    Reschedule a booking
 * @access  Private (user can only reschedule their own bookings)
 * @body    newDate, newSlot
 */
router.put('/:id/reschedule',
  checkBookingOwnership,
  checkBookingModifiable,
  checkSlotAvailability,
  sanitizeBookingData,
  rescheduleBooking
);

/**
 * @route   PUT /api/bookings/:id/payment-status
 * @desc    Update payment status for a booking
 * @access  Private (user can only update their own bookings)
 * @body    paymentDetails
 */
router.put('/:id/payment-status',
  checkBookingOwnership,
  updatePaymentStatus
);

// Admin-only routes (you can add admin middleware here)

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status (admin only)
 * @access  Private (admin only)
 * @body    status, notes
 */
router.put('/:id/status',
  // Add admin middleware here: requireAdmin,
  updateBookingStatus
);

/**
 * @route   GET /api/bookings/analytics/overview
 * @desc    Get booking analytics (admin only)
 * @access  Private (admin only)
 * @query   dateFrom, dateTo, status
 */
router.get('/analytics/overview',
  // Add admin middleware here: requireAdmin,
  getBookingAnalytics
);

export default router;