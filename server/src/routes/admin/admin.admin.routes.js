import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  resetAdminPassword,
  deleteAdmin,
  getAdminStats,
  getOnboardingStatus,
  resendOnboardingLink,
  invalidateOnboardingLink
} from '../../controllers/admin/admin.admin.controller.js';

const adminAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/admins
// @desc    Get all admins with filters, search, and pagination
// @access  Admin only
// @query   page, limit, search, status, sortBy, sortOrder
adminAdminRouter.get('/', checkAuth, requireAdmin, getAllAdmins);

// @route   GET /api/admin/admins/stats
// @desc    Get admin statistics
// @access  Admin only
adminAdminRouter.get('/stats', checkAuth, requireAdmin, getAdminStats);

// @route   GET /api/admin/admins/:id
// @desc    Get single admin details
// @access  Admin only
adminAdminRouter.get('/:id', checkAuth, requireAdmin, getAdminById);

// @route   POST /api/admin/admins
// @desc    Create a new admin
// @access  Admin only
// @body    { name, email, password, confirmPassword }
adminAdminRouter.post('/', checkAuth, requireAdmin, createAdmin);

// @route   PUT /api/admin/admins/:id
// @desc    Update admin (name, email, isActive)
// @access  Admin only
// @body    { name?, email?, isActive? }
adminAdminRouter.put('/:id', checkAuth, requireAdmin, updateAdmin);

// @route   PATCH /api/admin/admins/:id/password
// @desc    Reset admin password
// @access  Admin only
// @body    { password, confirmPassword }
adminAdminRouter.patch('/:id/password', checkAuth, requireAdmin, resetAdminPassword);

// @route   PATCH /api/admin/admins/:id/toggle-status
// @desc    Toggle admin active/inactive status
// @access  Admin only
adminAdminRouter.patch('/:id/toggle-status', checkAuth, requireAdmin, toggleAdminStatus);

// @route   DELETE /api/admin/admins/:id
// @desc    Delete admin
// @access  Admin only
adminAdminRouter.delete('/:id', checkAuth, requireAdmin, deleteAdmin);

// @route   GET /api/admin/admins/:id/onboarding-status
// @desc    Get onboarding status for an admin
// @access  Admin only
adminAdminRouter.get('/:id/onboarding-status', checkAuth, requireAdmin, getOnboardingStatus);

// @route   POST /api/admin/admins/:id/resend-onboarding-link
// @desc    Resend onboarding link (only if expired or invalidated)
// @access  Admin only
adminAdminRouter.post('/:id/resend-onboarding-link', checkAuth, requireAdmin, resendOnboardingLink);

// @route   POST /api/admin/admins/:id/invalidate-onboarding-link
// @desc    Invalidate active onboarding link (admin control for security)
// @access  Admin only
adminAdminRouter.post('/:id/invalidate-onboarding-link', checkAuth, requireAdmin, invalidateOnboardingLink);

export default adminAdminRouter;
