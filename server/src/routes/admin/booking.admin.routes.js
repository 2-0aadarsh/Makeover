import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingAnalytics,
  updatePaymentStatus
} from '../../controllers/admin/booking.admin.controller.js';

const bookingAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters, search, and pagination
// @access  Admin only
// @query   page, limit, status, paymentStatus, startDate, endDate, search, sortBy, sortOrder
bookingAdminRouter.get('/', checkAuth, requireAdmin,  getAllBookings);

// @route   GET /api/admin/bookings/analytics
// @desc    Get booking analytics and statistics
// @access  Admin only
// @query   startDate, endDate (optional)
bookingAdminRouter.get('/analytics', checkAuth, requireAdmin,  getBookingAnalytics);

// @route   GET /api/admin/bookings/:id
// @desc    Get single booking details
// @access  Admin only
bookingAdminRouter.get('/:id', checkAuth, requireAdmin, getBookingById);

// @route   PATCH /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Admin only
// @body    { status, adminNote }
bookingAdminRouter.patch('/:id/status', checkAuth, requireAdmin, updateBookingStatus);

// @route   PATCH /api/admin/bookings/:id/payment-status
// @desc    Update payment status
// @access  Admin only
// @body    { paymentStatus, adminNote }
bookingAdminRouter.patch('/:id/payment-status', checkAuth, requireAdmin, updatePaymentStatus);

// @route   POST /api/admin/bookings/:id/cancel
// @desc    Cancel booking (admin action)
// @access  Admin only
// @body    { reason, refundEligible }
bookingAdminRouter.post('/:id/cancel', checkAuth, requireAdmin, cancelBooking);

export default bookingAdminRouter;
