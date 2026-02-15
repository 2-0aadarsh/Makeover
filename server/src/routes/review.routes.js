import express from 'express';
import {
  verifyToken,
  createReview,
  updateReview,
  getPendingReviewsForUser,
  getMyReviews,
  getReviewById,
  getTestimonials,
  getTestimonialStats,
} from '../controllers/review.controller.js';
import { checkAuth, optionalAuth } from '../middlewares/auth.middleware.js';

const reviewRouter = express.Router();

/**
 * PUBLIC ROUTES (no auth)
 */

// @route   GET /api/reviews/testimonials
// @desc    Get published reviews for testimonials (homepage)
// @access  Public
reviewRouter.get('/testimonials', getTestimonials);

// @route   GET /api/reviews/testimonials/stats
// @desc    Get testimonial statistics (homepage)
// @access  Public
reviewRouter.get('/testimonials/stats', getTestimonialStats);

/**
 * PUBLIC ROUTES (token-based authentication)
 */

// @route   GET /api/reviews/verify-token/:token
// @desc    Verify review token and get booking details
// @access  Public
reviewRouter.get('/verify-token/:token', verifyToken);

// @route   POST /api/reviews
// @desc    Submit a review or complaint
// @access  Public (token-based) or Private (logged in user)
// Note: Uses optionalAuth - if user is logged in, their ID is attached
reviewRouter.post('/', optionalAuth, createReview);

/**
 * PRIVATE ROUTES (require authentication)
 */

// @route   GET /api/reviews/pending
// @desc    Get bookings pending review for current user
// @access  Private
reviewRouter.get('/pending', checkAuth, getPendingReviewsForUser);

// @route   GET /api/reviews/my-reviews
// @desc    Get user's submitted reviews
// @access  Private
reviewRouter.get('/my-reviews', checkAuth, getMyReviews);

// @route   GET /api/reviews/:reviewId
// @desc    Get a specific review by ID
// @access  Private (owner or admin)
reviewRouter.get('/:reviewId', checkAuth, getReviewById);

// @route   PATCH /api/reviews/:reviewId
// @desc    Edit an existing review (within 48hr window)
// @access  Private (owner only)
reviewRouter.patch('/:reviewId', checkAuth, updateReview);

export default reviewRouter;
