import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  forceSaveCartData,
  validateCartDataConsistency,
  validateAddressSelection,
  validateTimeSlotAvailability,
  lockTimeSlotCapacity,
  validateServiceAvailability,
  validatePaymentMethod,
  preventDuplicateBookings,
  validateBookingOwnership,
  validateBookingModification
} from '../middlewares/booking.middleware.js';
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  rescheduleBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStatistics
} from '../controllers/booking.controller.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// 🔒 SECURITY-FIRST BOOKING CREATION FLOW
// This route implements the enhanced security flow:
// 1. Force save cart data (bypass debounce)
// 2. Validate cart consistency (Redux vs DB)
// 3. Validate address, time slot, services, payment
// 4. Create booking with DATABASE cart data (source of truth)
router.post(
  '/',
  forceSaveCartData,
  validateCartDataConsistency,
  validateAddressSelection,
  validateTimeSlotAvailability,
  lockTimeSlotCapacity,
  validateServiceAvailability,
  validatePaymentMethod,
  preventDuplicateBookings,
  createBooking
);

// User booking operations
router.get('/', getUserBookings);
router.get('/user/:userId', getUserBookings); // Get bookings by userId
router.get('/:bookingId', validateBookingOwnership, getBookingDetails);

// Booking modifications (require ownership and validation)
router.patch(
  '/:bookingId/cancel',
  validateBookingOwnership,
  validateBookingModification,
  cancelBooking
);

router.patch(
  '/:bookingId/reschedule',
  validateBookingOwnership,
  validateBookingModification,
  rescheduleBooking
);

// Admin routes (require admin role)
router.get('/admin/all', requireAdmin, getAllBookings);
router.patch('/admin/:bookingId/status', requireAdmin, updateBookingStatus);
router.get('/admin/statistics', requireAdmin, getBookingStatistics);

export default router;



