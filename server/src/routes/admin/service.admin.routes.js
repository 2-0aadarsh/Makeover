import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceAvailability,
  getServicesByCategory,
  getServiceStats
} from '../../controllers/admin/service.admin.controller.js';

const serviceAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   POST /api/admin/services
// @desc    Create a new service
// @access  Admin only
// @body    FormData: name, description, bodyContent, price, duration, categoryId, ctaContent, cardType, images (Files)
serviceAdminRouter.post('/', checkAuth, requireAdmin, createService);

// @route   GET /api/admin/services
// @desc    Get all services with filters and pagination
// @access  Admin only
// @query   page, limit, categoryId, isActive, isAvailable, search, ctaContent, cardType, sortBy, sortOrder
serviceAdminRouter.get('/', checkAuth, requireAdmin, getAllServices);

// @route   GET /api/admin/services/stats
// @desc    Get service statistics
// @access  Admin only
serviceAdminRouter.get('/stats', checkAuth, requireAdmin, getServiceStats);

// @route   GET /api/admin/services/by-category/:categoryId
// @desc    Get all services in a category
// @access  Admin only
// @query   page, limit, isActive, isAvailable
serviceAdminRouter.get('/by-category/:categoryId', checkAuth, requireAdmin, getServicesByCategory);

// @route   GET /api/admin/services/:id
// @desc    Get single service details
// @access  Admin only
serviceAdminRouter.get('/:id', checkAuth, requireAdmin, getServiceById);

// @route   PUT /api/admin/services/:id
// @desc    Update service
// @access  Admin only
// @body    FormData: name, description, bodyContent, price, duration, categoryId, ctaContent, cardType, images (Files, optional)
serviceAdminRouter.put('/:id', checkAuth, requireAdmin, updateService);

// @route   PATCH /api/admin/services/:id/toggle
// @desc    Toggle service availability
// @access  Admin only
serviceAdminRouter.patch('/:id/toggle', checkAuth, requireAdmin, toggleServiceAvailability);

// @route   DELETE /api/admin/services/:id
// @desc    Delete service
// @access  Admin only
serviceAdminRouter.delete('/:id', checkAuth, requireAdmin, deleteService);

export default serviceAdminRouter;
