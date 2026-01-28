import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryServices
} from '../controllers/category.controller.js';

const router = express.Router();

/**
 * Public routes for categories (no authentication required)
 */

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get('/', getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   GET /api/categories/:id/services
// @desc    Get all active services for a category
// @access  Public
router.get('/:id/services', getCategoryServices);

export default router;
