import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
  getEnquiryStats
} from '../../controllers/admin/enquiry.admin.controller.js';

const enquiryAdminRouter = express.Router();

/**
 * All routes are protected with checkAuth (JWT verification) 
 * and requireAdmin (role check) middleware
 */

// @route   GET /api/admin/enquiries
// @desc    Get all enquiries with filters, search, and pagination
// @access  Admin only
// @query   page, limit, status, priority, source, assignedTo, startDate, endDate, search, sortBy, sortOrder
enquiryAdminRouter.get('/', checkAuth, requireAdmin, getAllEnquiries);

// @route   GET /api/admin/enquiries/stats
// @desc    Get enquiry statistics
// @access  Admin only
// @query   startDate, endDate (optional)
enquiryAdminRouter.get('/stats', checkAuth, requireAdmin, getEnquiryStats);

// @route   GET /api/admin/enquiries/:id
// @desc    Get single enquiry details
// @access  Admin only
enquiryAdminRouter.get('/:id', checkAuth, requireAdmin, getEnquiryById);

// @route   PATCH /api/admin/enquiries/:id/status
// @desc    Update enquiry status
// @access  Admin only
// @body    { status, adminNote }
enquiryAdminRouter.patch('/:id/status', checkAuth, requireAdmin, updateEnquiryStatus);

// @route   PATCH /api/admin/enquiries/:id/assign
// @desc    Assign enquiry to admin
// @access  Admin only
// @body    { assignedTo }
enquiryAdminRouter.patch('/:id/assign', checkAuth, requireAdmin, assignEnquiry);

// @route   POST /api/admin/enquiries/:id/notes
// @desc    Add admin note to enquiry
// @access  Admin only
// @body    { note, internalComment }
enquiryAdminRouter.post('/:id/notes', checkAuth, requireAdmin, addEnquiryNote);

export default enquiryAdminRouter;
