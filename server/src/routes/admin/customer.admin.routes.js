import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerStats
} from '../../controllers/admin/customer.admin.controller.js';

const customerAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/customers
// @desc    Get all customers with pagination and search
// @access  Admin only
// @query   page, limit, search, sortBy, sortOrder
customerAdminRouter.get('/', checkAuth, requireAdmin, getAllCustomers);

// @route   GET /api/admin/customers/stats
// @desc    Get customer statistics
// @access  Admin only
customerAdminRouter.get('/stats', checkAuth, requireAdmin, getCustomerStats);

// @route   GET /api/admin/customers/:id
// @desc    Get single customer details with booking history
// @access  Admin only
customerAdminRouter.get('/:id', checkAuth, requireAdmin, getCustomerById);

export default customerAdminRouter;
