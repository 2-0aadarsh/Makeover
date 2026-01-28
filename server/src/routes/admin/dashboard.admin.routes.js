import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getDashboardMetrics,
  getTodayBookings,
  getRecentActivity,
  getDashboardStats
} from '../../controllers/admin/dashboard.admin.controller.js';

const dashboardAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/dashboard/metrics
// @desc    Get dashboard metrics (Total Users, Bookings, Revenue, Upcoming)
// @access  Admin only
dashboardAdminRouter.get('/metrics', checkAuth, requireAdmin, getDashboardMetrics);

dashboardAdminRouter.get('/today-bookings', checkAuth, requireAdmin, getTodayBookings);

// @route   GET /api/admin/dashboard/recent-activity
// @desc    Get recent activity (bookings, enquiries, users)
// @access  Admin only
// @query   limit (optional, default: 5)
dashboardAdminRouter.get('/recent-activity', checkAuth, requireAdmin, getRecentActivity);

// @route   GET /api/admin/dashboard/stats
// @desc    Get additional statistics (status breakdown, revenue trends)
// @access  Admin only
dashboardAdminRouter.get('/stats', checkAuth, requireAdmin, getDashboardStats);

export default dashboardAdminRouter;
