import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllReviews,
  getReviewById,
  updateReviewStatus,
} from '../../controllers/admin/review.admin.controller.js';

const reviewAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/reviews
// @desc    Get all reviews/complaints with filters, search, and pagination
// @access  Admin only
// @query   page, limit, rating, status, type, search, sortBy, sortOrder
reviewAdminRouter.get('/', checkAuth, requireAdmin, getAllReviews);

// @route   GET /api/admin/reviews/:id
// @desc    Get review details by ID
// @access  Admin only
reviewAdminRouter.get('/:id', checkAuth, requireAdmin, getReviewById);

// @route   PATCH /api/admin/reviews/:id/status
// @desc    Update review/complaint status
// @access  Admin only
// @body    { status, adminResponse }
reviewAdminRouter.patch('/:id/status', checkAuth, requireAdmin, updateReviewStatus);

export default reviewAdminRouter;
