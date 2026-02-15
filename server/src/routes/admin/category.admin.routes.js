import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryServices,
  toggleCategoryActive
} from '../../controllers/admin/category.admin.controller.js';

const categoryAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   POST /api/admin/categories
// @desc    Create a new category
// @access  Admin only
// @body    FormData: name, description, displayOrder, image (File)
categoryAdminRouter.post('/', checkAuth, requireAdmin, createCategory);

// @route   GET /api/admin/categories
// @desc    Get all categories with filters and pagination
// @access  Admin only
// @query   page, limit, isActive, search, sortBy, sortOrder
categoryAdminRouter.get('/', checkAuth, requireAdmin, getAllCategories);

// @route   GET /api/admin/categories/:id
// @desc    Get single category details
// @access  Admin only
categoryAdminRouter.get('/:id', checkAuth, requireAdmin, getCategoryById);

// @route   GET /api/admin/categories/:id/services
// @desc    Get all services in a category
// @access  Admin only
// @query   page, limit, isActive
categoryAdminRouter.get('/:id/services', checkAuth, requireAdmin, getCategoryServices);

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Admin only
// @body    FormData: name, description, displayOrder, isActive, image (File, optional)
categoryAdminRouter.put('/:id', checkAuth, requireAdmin, updateCategory);

// @route   PATCH /api/admin/categories/:id/toggle-active
// @desc    Toggle category active status
// @access  Admin only
categoryAdminRouter.patch('/:id/toggle-active', checkAuth, requireAdmin, toggleCategoryActive);

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category (only if no services)
// @access  Admin only
categoryAdminRouter.delete('/:id', checkAuth, requireAdmin, deleteCategory);

export default categoryAdminRouter;
